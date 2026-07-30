import { db } from "@/lib/db";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, Clock, Users } from "lucide-react";

import { formatPrice, HOURLY_SALES, TOP_ITEMS, SLOW_ITEMS } from "@/lib/cafeData";

export default function Reports() {
  const [orders, setOrders] = useState([]);
  const [range, setRange] = useState("today");

  useEffect(() => {
    db.entities.Order.list("-created_date", 200)
      .then((list) => setOrders(Array.isArray(list) ? list : []))
      .catch(() => setOrders([]));
  }, []);

  const completed = orders.filter((o) => o.status !== "cancelled");
  const totalSales = completed.reduce((s, o) => s + (o.total || 0), 0);
  const orderCount = completed.length;
  const avgOrder = orderCount ? totalSales / orderCount : 0;

  const stats = [
    { label: "Total sales", value: formatPrice(totalSales), Icon: TrendingUp },
    { label: "Orders", value: orderCount, Icon: Users },
    { label: "Avg. order", value: formatPrice(avgOrder), Icon: Clock },
    { label: "Refunds", value: orders.filter((o) => o.status === "cancelled").length, Icon: TrendingDown },
  ];

  return (
    <div className="px-8 py-7">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[28px] font-medium">Sales reports</h1>
        <div className="flex gap-2">
          {["today", "week", "month"].map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`h-9 px-3 rounded-[10px] border text-sm capitalize ${range === r ? "bg-[hsl(var(--secondary))] border-[hsl(var(--secondary))] text-[hsl(var(--accent))]" : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"}`}>{r}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5">
            <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] mb-2"><Icon size={16} strokeWidth={1.5} /><span className="text-xs">{label}</span></div>
            <div className="text-[22px] font-medium text-[hsl(var(--primary))]">{value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5 mb-5">
        <div className="text-sm font-medium mb-4">Sales by hour</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={HOURLY_SALES}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} formatter={(v) => formatPrice(v)} />
            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5">
          <div className="text-sm font-medium mb-3 flex items-center gap-2"><TrendingUp size={16} strokeWidth={1.5} className="text-[hsl(var(--accent))]" /> Top sellers</div>
          <div className="space-y-2">
            {TOP_ITEMS.map((it) => (
              <div key={it.name} className="flex items-center justify-between text-sm">
                <span>{it.name}</span>
                <span className="text-[hsl(var(--muted-foreground))]">{it.qty} sold · <span className="text-[hsl(var(--foreground))]">{formatPrice(it.revenue)}</span></span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5">
          <div className="text-sm font-medium mb-3 flex items-center gap-2"><TrendingDown size={16} strokeWidth={1.5} className="text-[hsl(var(--muted-foreground))]" /> Slowest sellers</div>
          <div className="space-y-2">
            {SLOW_ITEMS.map((it) => (
              <div key={it.name} className="flex items-center justify-between text-sm">
                <span>{it.name}</span>
                <span className="text-[hsl(var(--muted-foreground))]">{it.qty} sold · <span className="text-[hsl(var(--foreground))]">{formatPrice(it.revenue)}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}