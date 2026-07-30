import { db } from "@/lib/db";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Banknote, CreditCard, Wallet, Check, Tag, X } from "lucide-react";
import { formatPrice, PROMOTIONS } from "@/lib/cafeData";
import { useCart } from "@/lib/CartContext";

export default function Payment() {
  const navigate = useNavigate();
  const { items, totals, orderType, table, billDiscount, setBillDiscount, clear } = useCart();
  const [method, setMethod] = useState("cash");
  const [split, setSplit] = useState(null); // { method1, amount1 }
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const p = PROMOTIONS.find((x) => x.code === code && x.active);
    if (!p) { setPromoMsg({ ok: false, text: "Invalid or expired code" }); return; }
    setBillDiscount({ code: p.code, type: p.type, value: p.value });
    setPromoMsg({ ok: true, text: `${p.code} applied` });
  };

  const handleConfirm = async () => {
    setConfirming(true);
    const orderNumber = "ORD-" + Date.now().toString().slice(-6);
    const payload = {
      order_number: orderNumber,
      order_type: orderType,
      table_number: orderType === "dine-in" ? table || "—" : "Takeaway",
      status: "new",
      items: items.map((l) => ({
        name: l.name, icon: l.icon, qty: l.qty, unitPrice: l.unitPrice, lineTotal: l.lineTotal,
        size: l.size?.name, temperature: l.temperature, sugar: l.sugar, ice: l.ice, note: l.note,
      })),
      subtotal: totals.subtotal,
      discount_amount: totals.discountAmount,
      discount_code: billDiscount?.code || "",
      tax: totals.tax,
      total: totals.total,
      payment_method: split ? "split" : method,
      payment_split: split ? `${split.method1}: ${formatPrice(split.amount1)}` : "",
      served_by: "Counter 1",
    };
    try {
      await db.entities.Order.create(payload);
    } catch (e) {
      // offline queue fallback
      const q = JSON.parse(localStorage.getItem("pos_pending_orders") || "[]");
      q.push(payload);
      localStorage.setItem("pos_pending_orders", JSON.stringify(q));
    }
    setConfirming(false);
    clear();
    navigate("/order");
  };

  return (
    <div className="min-h-screen px-8 py-7 max-w-3xl mx-auto">
      {/* Cashier profile — single instance */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[hsl(var(--secondary))] flex items-center justify-center text-[hsl(var(--accent))] font-medium">CM</div>
        <div>
          <div className="text-sm font-medium">Counter 1 · Cashier</div>
          <div className="text-xs text-[hsl(var(--muted-foreground))]">Checkout</div>
        </div>
      </div>

      <h1 className="text-[28px] font-medium mb-5">Payment</h1>

      {/* Single order summary panel */}
      <div className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">{orderType === "dine-in" ? `Table ${table || "—"}` : "Takeaway"}</div>
          <div className="text-xs text-[hsl(var(--muted-foreground))]">{items.length} items</div>
        </div>
        <div className="space-y-2">
          {items.map((l) => (
            <div key={l.lineId} className="flex items-start justify-between text-sm">
              <div className="flex items-start gap-2">
                <span>{l.icon}</span>
                <div>
                  <span>{l.qty}× {l.name}</span>
                  {l.note && <span className="block text-[11px] text-[hsl(var(--accent))] italic">“{l.note}”</span>}
                </div>
              </div>
              <span className="text-[hsl(var(--foreground))]">{formatPrice(l.lineTotal)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[hsl(var(--border))] mt-4 pt-3 space-y-1.5">
          <SummaryRow label="Subtotal" value={formatPrice(totals.subtotal)} />
          {billDiscount && <SummaryRow label={`Discount · ${billDiscount.code}`} value={`−${formatPrice(totals.discountAmount)}`} accent />}
          <SummaryRow label="Tax (8%)" value={formatPrice(totals.tax)} muted />
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium">Total</span>
            <span className="text-[24px] font-medium text-[hsl(var(--primary))]">{formatPrice(totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Promo */}
      <div className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Tag size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Promo code" className="w-full h-11 pl-9 pr-3 rounded-[10px] border border-[hsl(var(--border))] text-sm focus:outline-none focus:border-[hsl(var(--primary))]" />
        </div>
        <button onClick={handleApplyPromo} className="h-11 px-4 rounded-[10px] border border-[hsl(var(--border))] text-sm">Apply</button>
        {billDiscount && (
          <button onClick={() => { setBillDiscount(null); setPromoInput(""); setPromoMsg(null); }} className="h-11 px-3 rounded-[10px] border border-[hsl(var(--border))] text-sm text-[hsl(var(--muted-foreground))]"><X size={16} strokeWidth={1.5} /></button>
        )}
      </div>
      {promoMsg && <div className={`text-xs mt-1.5 ${promoMsg.ok ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--destructive))]"}`}>{promoMsg.text}</div>}

      {/* Payment method — only here */}
      <div className="mt-5">
        <div className="text-[13px] text-[hsl(var(--muted-foreground))] mb-2">Payment method</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "cash", label: "Cash", Icon: Banknote },
            { id: "card", label: "Card", Icon: CreditCard },
            { id: "e-wallet", label: "E-wallet", Icon: Wallet },
          ].map(({ id, label, Icon }) => (
            <button key={id} onClick={() => { setMethod(id); setSplit(null); }} className={`h-16 rounded-[12px] border flex flex-col items-center justify-center gap-1 ${selectedBox(method === id && !split)}`}>
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => split ? setSplit(null) : setSplit({ method1: "cash", amount1: Math.round(totals.total / 2) })} className="mt-2 text-xs text-[hsl(var(--accent))] underline">
          {split ? "Cancel split" : "Split payment across two methods"}
        </button>
        {split && (
          <div className="mt-3 rounded-[12px] border border-[hsl(var(--border))] p-4 bg-[hsl(var(--card))]">
            <div className="text-xs text-[hsl(var(--muted-foreground))] mb-2">Split payment</div>
            <div className="flex items-center gap-2 mb-2">
              <select value={split.method1} onChange={(e) => setSplit({ ...split, method1: e.target.value })} className="h-10 rounded-[8px] border border-[hsl(var(--border))] text-sm px-2 bg-transparent">
                <option value="cash">Cash</option><option value="card">Card</option><option value="e-wallet">E-wallet</option>
              </select>
              <input type="number" value={split.amount1} onChange={(e) => setSplit({ ...split, amount1: Number(e.target.value) })} className="flex-1 h-10 rounded-[8px] border border-[hsl(var(--border))] text-sm px-3" />
            </div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">Balance on second method: <span className="text-[hsl(var(--foreground))]">{formatPrice(Math.max(0, totals.total - split.amount1))}</span></div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6">
        <button onClick={handleConfirm} disabled={confirming || items.length === 0} className="w-full h-12 rounded-[10px] bg-[hsl(var(--primary))] text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-40">
          <Check size={16} strokeWidth={1.5} /> {confirming ? "Processing…" : `Confirm payment · ${formatPrice(totals.total)}`}
        </button>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <button onClick={() => navigate("/order")} className="h-11 rounded-[10px] border border-[hsl(var(--border))] text-sm">Save for later</button>
          <button onClick={() => navigate("/order")} className="h-11 rounded-[10px] border border-[hsl(var(--border))] text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

const selectedBox = (is) => (is ? "bg-[hsl(var(--secondary))] border-[hsl(var(--secondary))] text-[hsl(var(--accent))]" : "border-[hsl(var(--border))] text-[hsl(var(--foreground))]");

function SummaryRow({ label, value, muted, accent }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-[hsl(var(--muted-foreground))]">{label}</span>
      <span className={`text-sm ${accent ? "text-[hsl(var(--accent))]" : muted ? "text-[hsl(var(--muted-foreground))]" : "text-[hsl(var(--foreground))]"}`}>{value}</span>
    </div>
  );
}