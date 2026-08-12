import React, { useEffect, useMemo, useState } from "react";
import { Clock, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatPrice } from "@/lib/cafeData";
import { fetchReportSummary } from "@/lib/catalogStore";

const hourLabel = (hour) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const value = hour % 12 || 12;
  return `${value} ${suffix}`;
};

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchReportSummary()
      .then((data) => { if (!cancelled) setReport(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const hourly = useMemo(() => {
    const byHour = new Map((report?.hourly || []).map((row) => [Number(row.hour), row]));
    return Array.from({ length: 24 }, (_, hour) => ({
      hour: hourLabel(hour),
      sales: Number(byHour.get(hour)?.sales || 0),
      orders: Number(byHour.get(hour)?.orders || 0),
    }));
  }, [report]);

  if (loading || error) {
    return <div className={`px-8 py-7 text-sm ${error ? "text-red-400" : "text-[hsl(var(--muted-foreground))]"}`}>{error ? `Couldn't load reports: ${error}` : "Loading reports..."}</div>;
  }

  const sales = Number(report?.summary?.total_sales || 0);
  const orderCount = Number(report?.summary?.completed_orders || 0);
  const refunds = Number(report?.summary?.refunds || 0);
  const topSellers = report?.top_sellers || [];
  const stats = [
    ["Total sales", formatPrice(sales), TrendingUp],
    ["Orders", orderCount, Users],
    ["Avg. order", formatPrice(orderCount ? sales / orderCount : 0), Clock],
    ["Refunds", refunds, TrendingDown],
  ];

  return (
    <div className="px-8 py-7">
      <h1 className="text-[28px] font-medium mb-1">Sales reports</h1>
      <p className="text-xs text-[hsl(var(--muted-foreground))] mb-5">All-time completed order data · Pakistan time</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(([label, value, Icon]) => (
          <div className="rounded-xl bg-[hsl(var(--card))] border p-5" key={label}>
            <div className="flex gap-2 text-xs text-[hsl(var(--muted-foreground))]"><Icon size={16} />{label}</div>
            <div className="text-2xl text-[hsl(var(--primary))]">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-5 mt-5">
        <section className="rounded-xl bg-[hsl(var(--card))] border p-5">
          <div className="font-medium mb-1">Sales by hour</div>
          <div className="text-xs text-[hsl(var(--muted-foreground))] mb-4">Revenue from completed orders</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourly} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                <Tooltip formatter={(value) => formatPrice(Number(value))} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="sales" name="Sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl bg-[hsl(var(--card))] border p-5">
          <div className="font-medium mb-1">Top sellers</div>
          <div className="text-xs text-[hsl(var(--muted-foreground))] mb-4">Ranked by quantity sold</div>
          {topSellers.length === 0 ? (
            <div className="py-10 text-center text-sm text-[hsl(var(--muted-foreground))]">No completed order items yet.</div>
          ) : (
            <div className="space-y-3">
              {topSellers.map((item, index) => (
                <div key={`${item.menu_item_id}-${item.name}`} className="flex items-center gap-3">
                  <div className="w-6 text-xs text-[hsl(var(--muted-foreground))]">#{index + 1}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{item.name}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">{Number(item.quantity)} sold</div>
                  </div>
                  <div className="text-sm text-[hsl(var(--primary))]">{formatPrice(Number(item.revenue))}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
