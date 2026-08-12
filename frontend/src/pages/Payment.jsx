import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Banknote, Check, CreditCard, Wallet } from "lucide-react";
import { formatPrice } from "@/lib/cafeData";
import { useCart } from "@/lib/CartContext";
import Receipt from "@/components/Receipt";
import { apiPost } from "@/lib/apiClient";

const METHODS = [
  { id: "cash", label: "Cash", Icon: Banknote },
  { id: "card", label: "Card", Icon: CreditCard },
  { id: "e-wallet", label: "E-wallet", Icon: Wallet },
];

export default function Payment() {
  const navigate = useNavigate();
  const { items, totals, orderType, table, billDiscount, clear } = useCart();
  const [method, setMethod] = useState("cash");
  const [split, setSplit] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const orderPayload = (status = "completed") => ({
    order_type: orderType,
    table_or_address: orderType === "dine-in" || orderType === "delivery" ? table || null : null,
    status,
    payment_method: split ? "split" : method,
    payment_details: split ? {
      payments: [
        { method: split.method1, amount: Number(split.amount1) },
        { method: split.method2, amount: Math.max(0, totals.total - Number(split.amount1)) },
      ],
    } : undefined,
    lines: items.map((line) => ({
      menu_item_id: line.itemId,
      qty: line.qty,
      size: line.size?.name,
      temperature: line.temperature,
      sugar: line.sugar,
      ice: line.ice,
      note: line.note,
      addon_ids: (line.addons || []).map((addon) => addon.id),
    })),
  });

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const saved = await apiPost("/orders", orderPayload());
      setReceipt({
        ...saved.receipt_settings,
        order_number: saved.order_number,
        order_type: saved.order_type,
        payment_details: saved.payment_details,
        items: saved.lines.map((line) => ({ name: line.name_snapshot, qty: line.qty, lineTotal: Number(line.line_total) })),
        subtotal: Number(saved.subtotal),
        delivery_fee: Number(saved.delivery_fee),
        tax: Number(saved.tax),
        total: Number(saved.total),
      });
    } catch (err) {
      alert("Couldn't save this order: " + err.message);
    } finally {
      setConfirming(false);
    }
  };

  const saveDraft = async () => {
    if (!items.length) return;
    setConfirming(true);
    try {
      await apiPost("/orders", orderPayload("draft"));
      clear();
      navigate("/history");
    } catch (err) {
      alert("Couldn't save this draft: " + err.message);
    } finally {
      setConfirming(false);
    }
  };

  const cancel = () => {
    clear();
    navigate("/order");
  };

  useEffect(() => {
    if (!receipt) return undefined;
    const printed = () => { clear(); navigate("/order"); };
    window.addEventListener("afterprint", printed);
    return () => window.removeEventListener("afterprint", printed);
  }, [receipt, clear, navigate]);

  const place = orderType === "dine-in" ? `Table ${table || "—"}` : orderType === "delivery" ? `Delivery — ${table || "no address"}` : "Takeaway";

  return (
    <div className="min-h-screen px-8 py-7 max-w-3xl mx-auto">
      <div className="mb-6"><div className="text-sm font-medium">Counter 1 · Admin</div><div className="text-xs text-[hsl(var(--muted-foreground))]">Checkout</div></div>
      <h1 className="text-[28px] font-medium mb-5">Payment</h1>
      <section className="rounded-xl bg-[hsl(var(--card))] border p-5">
        <div className="flex justify-between mb-4"><span className="font-medium text-sm">{place}</span><span className="text-xs">{items.length} items</span></div>
        {items.map((line) => <div className="flex justify-between text-sm mb-2" key={line.lineId}><span>{line.qty}× {line.name}{line.note && <small className="block italic">“{line.note}”</small>}</span><span>{formatPrice(line.lineTotal)}</span></div>)}
        <div className="border-t mt-4 pt-3 space-y-1"><Row label="Subtotal" value={formatPrice(totals.subtotal)} />{totals.deliveryFee > 0 && <Row label="Delivery fee" value={formatPrice(totals.deliveryFee)} />}{billDiscount && <Row label={`Discount · ${billDiscount.code}`} value={`−${formatPrice(totals.discountAmount)}`} />}<Row label="Tax" value={formatPrice(totals.tax)} /><div className="flex justify-between pt-2 font-medium"><span>Total</span><span className="text-2xl text-[hsl(var(--primary))]">{formatPrice(totals.total)}</span></div></div>
      </section>

      <section className="mt-5">
        <div className="text-sm mb-2">Payment method</div>
        <div className="grid grid-cols-3 gap-3">{METHODS.map(({ id, label, Icon }) => <button key={id} onClick={() => { setMethod(id); setSplit(null); }} className={`h-16 rounded-xl border flex flex-col items-center justify-center ${method === id && !split ? "border-[hsl(var(--primary))]" : ""}`}><Icon size={20} /><span className="text-xs">{label}</span></button>)}</div>
        <p className="mt-2 text-[11px] text-[hsl(var(--muted-foreground))]">Card and e-wallet selections record an externally completed payment; no payment gateway is connected yet.</p>
        <button className="mt-2 text-xs underline" onClick={() => setSplit(split ? null : { method1: "cash", method2: "card", amount1: Number((totals.total / 2).toFixed(2)) })}>{split ? "Cancel split" : "Split payment across two methods"}</button>
        {split && <div className="mt-3 border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-2"><select value={split.method1} onChange={(e) => setSplit({ ...split, method1: e.target.value })} className="h-10 border rounded px-2">{METHODS.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}</select><input aria-label="First split amount" type="number" min="0.01" max={totals.total - 0.01} step="0.01" value={split.amount1} onChange={(e) => setSplit({ ...split, amount1: Number(e.target.value) })} className="h-10 border rounded px-2" /><select value={split.method2} onChange={(e) => setSplit({ ...split, method2: e.target.value })} className="h-10 border rounded px-2">{METHODS.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}</select><div className="sm:col-span-3 text-xs">Second payment: {formatPrice(Math.max(0, totals.total - Number(split.amount1)))}</div></div>}
      </section>

      <section className="mt-6">
        <button onClick={handleConfirm} disabled={confirming || !items.length || receipt} className="w-full h-12 rounded bg-[hsl(var(--primary))] text-white disabled:opacity-40"><Check className="inline mr-2" size={16} />{confirming ? "Processing..." : `Confirm payment · ${formatPrice(totals.total)}`}</button>
        <div className="grid grid-cols-2 gap-3 mt-2"><button onClick={saveDraft} disabled={confirming || !items.length} className="h-11 border rounded disabled:opacity-40">Save for later</button><button onClick={cancel} disabled={confirming} className="h-11 border rounded disabled:opacity-40">Cancel order</button></div>
        {receipt && <button onClick={() => window.print()} className="w-full h-12 mt-3 rounded bg-[hsl(var(--primary))] text-white">Print receipt</button>}
      </section>
      <Receipt order={receipt} />
    </div>
  );
}

function Row({ label, value }) { return <div className="flex justify-between text-sm"><span>{label}</span><span>{value}</span></div>; }
