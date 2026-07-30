import { db } from "@/lib/db";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";

import { formatPrice } from "@/lib/cafeData";

const STATUS_FLOW = ["new", "preparing", "ready", "completed"];
const STATUS_LABEL = { new: "New", preparing: "Preparing", ready: "Ready", completed: "Completed" };
const STATUS_PILL = {
  new: "bg-[hsl(var(--secondary))] text-[hsl(var(--accent))]",
  preparing: "bg-[#FBE9D5] text-[#C46A1A]",
  ready: "bg-[#E3F0E7] text-[#3E7A4F]",
  completed: "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]",
};

function elapsedLabel(createdDate) {
  const secs = Math.floor((Date.now() - new Date(createdDate).getTime()) / 1000);
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  return `${m}m ${secs % 60}s`;
}

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("all");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = () => db.entities.Order.filter({ status: { $ne: "cancelled" } }, "-created_date", 50)
      .then((list) => mounted && setOrders(Array.isArray(list) ? list : []))
      .catch(() => {});
    load();
    const unsub = db.entities.Order.subscribe((event) => {
      setOrders((prev) => {
        if (event.type === "create") return [event.data, ...prev];
        if (event.type === "update") return prev.map((o) => (o.id === event.data.id ? event.data : o));
        if (event.type === "delete") return prev.filter((o) => o.id !== event.id);
        return prev;
      });
    });
    return () => { mounted = false; if (typeof unsub === "function") unsub(); };
  }, []);

  useEffect(() => { const t = setInterval(() => setTick((x) => x + 1), 1000); return () => clearInterval(t); }, []);

  const advance = async (order) => {
    const idx = STATUS_FLOW.indexOf(order.status);
    const next = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)];
    try {
      const updated = await db.entities.Order.update(order.id, { status: next });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
    } catch (e) { setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: next } : o))); }
  };

  const visible = orders
    .filter((o) => tab === "all" || o.status === tab)
    .sort((a, b) => (STATUS_FLOW.indexOf(a.status) - STATUS_FLOW.indexOf(b.status)) || (new Date(a.created_date) - new Date(b.created_date)));

  return (
    <div className="px-8 py-7">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[28px] font-medium">Kitchen queue</h1>
        <span className="text-xs text-[hsl(var(--muted-foreground))]">Live · {tick >= 0 ? "" : ""}{orders.filter((o) => o.status !== "completed").length} active</span>
      </div>

      <div className="flex gap-2 mb-5">
        {["all", ...STATUS_FLOW].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`h-9 px-4 rounded-[10px] border text-sm capitalize ${tab === t ? "bg-[hsl(var(--secondary))] border-[hsl(var(--secondary))] text-[hsl(var(--accent))]" : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"}`}>
            {t === "all" ? "All" : STATUS_LABEL[t]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="text-center text-sm text-[hsl(var(--muted-foreground))] py-20">No orders in this view.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((o) => (
            <motion.div key={o.id} layout className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-medium">#{o.order_number?.slice(-4) || "—"}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">{o.table_number || "Takeaway"}</div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${STATUS_PILL[o.status]}`}>{STATUS_LABEL[o.status]}</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {o.items?.map((it, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5"><span>{it.icon}</span>{it.qty}× {it.name}</span>
                  </div>
                ))}
                {(o.items || []).filter((it) => it.note).length > 0 && (
                  <div className="text-[11px] text-[hsl(var(--accent))] italic mt-1">
                    {o.items.filter((it) => it.note).map((it) => `${it.name}: ${it.note}`).join(" · ")}
                </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]"><Clock size={13} strokeWidth={1.5} /> {elapsedLabel(o.created_date)}</span>
                {o.status !== "completed" && (
                  <button onClick={() => advance(o)} className="h-9 px-3 rounded-[8px] bg-[hsl(var(--primary))] text-white text-xs font-medium flex items-center gap-1">
                    {STATUS_LABEL[STATUS_FLOW[STATUS_FLOW.indexOf(o.status) + 1]]} <ArrowRight size={14} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}