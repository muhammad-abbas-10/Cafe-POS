import React, { useEffect, useState } from "react";
import { Eye, Printer, RotateCcw, Search } from "lucide-react";
import { formatPrice } from "@/lib/cafeData";
import { fetchOrderById, fetchOrders, updateOrderStatus } from "@/lib/catalogStore";
import Receipt from "@/components/Receipt";

const METHODS = { cash: "Cash", card: "Card", "e-wallet": "E-wallet", split: "Split" };

function toReceipt(order) {
  return {
    ...order.receipt_settings,
    order_number: order.order_number,
    order_type: order.order_type,
    payment_details: order.payment_details,
    items: order.lines.map((line) => ({ name: line.name_snapshot, qty: line.qty, lineTotal: Number(line.line_total) })),
    subtotal: Number(order.subtotal),
    delivery_fee: Number(order.delivery_fee),
    tax: Number(order.tax),
    total: Number(order.total),
  };
}

export default function History() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [printOrder, setPrintOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchOrders().then((rows) => !cancelled && setOrders(rows)).catch((err) => !cancelled && setError(err.message)).finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const visible = orders.filter((order) => (filter === "all" || order.payment_method === filter) && (!query.trim() || order.order_number?.toLowerCase().includes(query.toLowerCase()) || String(order.total).includes(query)));
  const view = async (order) => { setSelected({ ...order, lines: null }); try { setSelected(await fetchOrderById(order.id)); } catch (err) { alert(err.message); setSelected(null); } };
  const reprint = async (order) => { try { const detailed = await fetchOrderById(order.id); setPrintOrder(toReceipt(detailed)); setTimeout(() => window.print(), 0); } catch (err) { alert(err.message); } };
  const refund = async (order) => { if (!confirm(`Refund order #${order.order_number}?`)) return; try { const saved = await updateOrderStatus(order.id, "refunded"); setOrders((rows) => rows.map((row) => row.id === saved.id ? saved : row)); } catch (err) { alert(err.message); } };

  if (loading || error) return <div className={`px-8 py-7 text-sm ${error ? "text-red-400" : "text-[hsl(var(--muted-foreground))]"}`}>{error ? `Couldn't load orders: ${error}` : "Loading orders..."}</div>;

  return (
    <div className="px-8 py-7">
      <h1 className="text-[28px] font-medium mb-5">Order history</h1>
      <div className="flex flex-wrap gap-3 mb-4"><label className="relative flex-1 min-w-[220px]"><Search size={18} className="absolute left-3 top-3" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by order no. or amount..." className="w-full h-11 pl-10 pr-3 rounded border" /></label><div className="flex gap-2">{["all", "cash", "card", "e-wallet", "split"].map((paymentMethod) => <button key={paymentMethod} onClick={() => setFilter(paymentMethod)} className="h-11 px-3 border rounded text-sm">{paymentMethod === "all" ? "All methods" : METHODS[paymentMethod]}</button>)}</div></div>
      <div className="rounded-xl bg-[hsl(var(--card))] border overflow-hidden"><table className="w-full text-sm"><thead><tr className="text-left text-xs border-b"><th className="px-4 py-3">Order</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Table</th><th className="px-4 py-3">Method</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody>{visible.map((order) => <tr key={order.id} className="border-b"><td className="px-4 py-3 font-medium">#{order.order_number?.slice(-6)}</td><td className="px-4 py-3">{new Date(order.created_at).toLocaleString()}</td><td className="px-4 py-3">{order.table_or_address || "—"}</td><td className="px-4 py-3">{METHODS[order.payment_method] || order.payment_method}</td><td className="px-4 py-3 capitalize">{order.status}</td><td className="px-4 py-3 text-right font-medium">{formatPrice(Number(order.total))}</td><td className="px-4 py-3"><div className="flex justify-end gap-2"><button title="View" onClick={() => view(order)}><Eye size={16} /></button>{order.status !== "draft" && <button title="Reprint" onClick={() => reprint(order)}><Printer size={16} /></button>}{order.status === "completed" && <button title="Refund" onClick={() => refund(order)}><RotateCcw size={16} /></button>}</div></td></tr>)}{!visible.length && <tr><td colSpan="7" className="p-10 text-center">No orders found.</td></tr>}</tbody></table></div>
      {selected && <OrderModal order={selected} onClose={() => setSelected(null)} />}
      <Receipt order={printOrder} />
    </div>
  );
}

function OrderModal({ order, onClose }) {
  const payments = order.payment_details?.payments || [];
  return <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" onClick={onClose}><div className="w-full max-w-md p-5 rounded-xl bg-[hsl(var(--card))]" onClick={(event) => event.stopPropagation()}><div className="font-medium">Order #{order.order_number?.slice(-6)}</div>{!order.lines ? <p className="py-4">Loading order details...</p> : <div className="py-4 space-y-2">{order.lines.map((line) => <div key={line.id} className="flex justify-between"><span>{line.qty}× {line.name_snapshot} · {line.size}</span><span>{formatPrice(Number(line.line_total))}</span></div>)}</div>}<div className="border-t pt-3 space-y-1"><div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(Number(order.subtotal))}</span></div><div className="flex justify-between"><span>Tax</span><span>{formatPrice(Number(order.tax))}</span></div><div className="flex justify-between font-medium"><span>Total</span><span>{formatPrice(Number(order.total))}</span></div>{payments.map((payment, index) => <div key={`${payment.method}-${index}`} className="flex justify-between text-xs text-[hsl(var(--muted-foreground))]"><span>{METHODS[payment.method] || payment.method}</span><span>{formatPrice(Number(payment.amount))}</span></div>)}</div><button className="w-full h-10 border rounded mt-4" onClick={onClose}>Close</button></div></div>;
}
