import { db } from "@/lib/db";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, Printer, Eye } from "lucide-react";

import { formatPrice } from "@/lib/cafeData";

const METHOD_LABEL = { cash: "Cash", card: "Card", "e-wallet": "E-wallet", split: "Split" };

export default function History() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    db.entities.Order.list("-created_date", 100)
      .then((list) => setOrders(Array.isArray(list) ? list : []))
      .catch(() => setOrders([]));
  }, []);

  const filtered = orders.filter((o) => {
    if (methodFilter !== "all" && o.payment_method !== methodFilter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (!o.order_number?.toLowerCase().includes(q) && !`${o.total}`.includes(q)) return false;
    }
    return true;
  });

  const refund = async (o) => {
    try {
      const updated = await db.entities.Order.update(o.id, { status: "cancelled" });
      setOrders((prev) => prev.map((x) => (x.id === o.id ? updated : x)));
    } catch (e) {
      setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: "cancelled" } : x)));
    }
  };

  return (
    <div className="px-8 py-7">
      <h1 className="text-[28px] font-medium mb-5">Order history</h1>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={18} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by order no. or amount…" className="w-full h-11 pl-10 pr-3 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm focus:outline-none focus:border-[hsl(var(--primary))]" />
        </div>
        <div className="flex gap-2">
          {["all", "cash", "card", "e-wallet", "split"].map((m) => (
            <button key={m} onClick={() => setMethodFilter(m)} className={`h-11 px-3 rounded-[10px] border text-sm capitalize ${methodFilter === m ? "bg-[hsl(var(--secondary))] border-[hsl(var(--secondary))] text-[hsl(var(--accent))]" : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"}`}>
              {m === "all" ? "All methods" : METHOD_LABEL[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[12px] text-[hsl(var(--muted-foreground))] border-b border-[hsl(var(--border))]">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Table</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-[hsl(var(--border))] last:border-0">
                <td className="px-4 py-3 font-medium">#{o.order_number?.slice(-4) || "—"}</td>
                <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{new Date(o.created_date).toLocaleString()}</td>
                <td className="px-4 py-3">{o.table_number || "—"}</td>
                <td className="px-4 py-3 capitalize">{METHOD_LABEL[o.payment_method] || o.payment_method}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 rounded-full ${o.status === "cancelled" ? "bg-[#F8E3E3] text-[#A14B4B]" : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"}`}>{o.status}</span>
                </td>
                <td className="px-4 py-3 text-right font-medium">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setSelected(o)} className="w-8 h-8 rounded-md border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))]" title="View"><Eye size={15} strokeWidth={1.5} /></button>
                    <button onClick={() => window.print()} className="w-8 h-8 rounded-md border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))]" title="Reprint"><Printer size={15} strokeWidth={1.5} /></button>
                    {o.status !== "cancelled" && (
                      <button onClick={() => refund(o)} className="w-8 h-8 rounded-md border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))]" title="Refund"><RotateCcw size={15} strokeWidth={1.5} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-[hsl(var(--muted-foreground))]">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setSelected(null)}>
          <div className="bg-[hsl(var(--card))] w-full max-w-md rounded-[12px] border border-[hsl(var(--border))] p-5" onClick={(e) => e.stopPropagation()}>
            <div className="text-sm font-medium mb-1">Order #{selected.order_number?.slice(-4)}</div>
            <div className="text-xs text-[hsl(var(--muted-foreground))] mb-4">{new Date(selected.created_date).toLocaleString()}</div>
            <div className="space-y-2 mb-4">
              {selected.items?.map((it, i) => (
                <div key={i} className="flex justify-between text-sm"><span>{it.qty}× {it.name}</span><span>{formatPrice(it.lineTotal)}</span></div>
              ))}
            </div>
            <div className="border-t border-[hsl(var(--border))] pt-3 space-y-1.5">
              <div className="flex justify-between text-sm"><span className="text-[hsl(var(--muted-foreground))]">Subtotal</span><span>{formatPrice(selected.subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[hsl(var(--muted-foreground))]">Tax</span><span>{formatPrice(selected.tax)}</span></div>
              <div className="flex justify-between text-sm font-medium"><span>Total</span><span className="text-[hsl(var(--primary))]">{formatPrice(selected.total)}</span></div>
            </div>
            <button onClick={() => setSelected(null)} className="w-full h-10 mt-4 rounded-[8px] border border-[hsl(var(--border))] text-sm">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}