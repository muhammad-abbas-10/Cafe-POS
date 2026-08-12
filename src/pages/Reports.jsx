import React, { useEffect, useState } from "react";
import { Clock, TrendingDown, TrendingUp, Users } from "lucide-react";
import { formatPrice } from "@/lib/cafeData";
import { fetchOrders } from "@/lib/catalogStore";

export default function Reports() {
  const [orders, setOrders] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState("");
  useEffect(() => { let cancelled = false; fetchOrders().then((rows) => !cancelled && setOrders(rows)).catch((err) => !cancelled && setError(err.message)).finally(() => !cancelled && setLoading(false)); return () => { cancelled = true; }; }, []);
  if (loading || error) return <div className={`px-8 py-7 text-sm ${error ? "text-red-400" : "text-[hsl(var(--muted-foreground))]"}`}>{error ? `Couldn't load reports: ${error}` : "Loading reports..."}</div>;
  const completed = orders.filter((order) => order.status === "completed"); const sales = completed.reduce((sum, order) => sum + Number(order.total), 0); const stats = [["Total sales", formatPrice(sales), TrendingUp], ["Orders", completed.length, Users], ["Avg. order", formatPrice(completed.length ? sales / completed.length : 0), Clock], ["Refunds", orders.filter((order) => ["refunded", "voided"].includes(order.status)).length, TrendingDown]];
  return <div className="px-8 py-7"><h1 className="text-[28px] font-medium mb-5">Sales reports</h1><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{stats.map(([label, value, Icon]) => <div className="rounded-xl bg-[hsl(var(--card))] border p-5" key={label}><div className="flex gap-2 text-xs text-[hsl(var(--muted-foreground))]"><Icon size={16} />{label}</div><div className="text-2xl text-[hsl(var(--primary))]">{value}</div></div>)}</div><div className="rounded-xl bg-[hsl(var(--card))] border p-5 mt-5 text-sm text-[hsl(var(--muted-foreground))]">Detailed hourly and item-level reports will appear once order-line aggregation is available from the backend.</div></div>;
}
