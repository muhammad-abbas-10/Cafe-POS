import React from "react";
import { createPortal } from "react-dom";
import { formatPrice } from "@/lib/cafeData";

const ORDER_TYPE_LABEL = { "dine-in": "Dine-in", takeaway: "Takeaway", delivery: "Delivery" };

export default function Receipt({ order }) {
  if (!order) return null;

  const bizName = localStorage.getItem("pos_biz_name") || "Your Café Name";
  const bizAddress = localStorage.getItem("pos_biz_address") || "1234 Main Street, Your City";
  const bizPhone = localStorage.getItem("pos_biz_phone") || "123-456-7890";
  const now = new Date();

  return createPortal(
    <div className="receipt-print hidden">
      <div className="receipt-torn-top" />
      <div className="receipt-paper mx-auto bg-white text-black font-mono px-5 pt-2 pb-4">
        <div className="text-center font-bold tracking-wide text-[14px] mb-1">{bizName.toUpperCase()}</div>
        <div className="text-center text-[10px] leading-tight"><div>Address: {bizAddress}</div><div>Tel: {bizPhone}</div></div>
        <div className="flex justify-between text-[10px] mt-3 border-t border-dashed border-black pt-2"><span>Date: {now.toLocaleDateString()}</span><span>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>
        <div className="text-[10px] mt-0.5">Order: {order.order_number} · {ORDER_TYPE_LABEL[order.order_type] || order.order_type}</div>
        <div className="mt-3 border-t border-dashed border-black pt-2 space-y-1">
          {order.items.map((line, index) => <div key={index} className="flex justify-between text-[11px] gap-2"><span className="flex-1 truncate">{line.qty}× {line.name}</span><span>{formatPrice(line.lineTotal)}</span></div>)}
        </div>
        <div className="mt-3 border-t border-dashed border-black pt-2 space-y-1 text-[11px]">
          <div className="flex justify-between"><span>Sub-total</span><span>{formatPrice(order.subtotal)}</span></div>
          {order.discount_amount > 0 && <div className="flex justify-between"><span>Discount</span><span>-{formatPrice(order.discount_amount)}</span></div>}
          {order.delivery_fee > 0 && <div className="flex justify-between"><span>Delivery fee</span><span>{formatPrice(order.delivery_fee)}</span></div>}
          <div className="flex justify-between"><span>Sales Tax</span><span>{formatPrice(order.tax)}</span></div>
          <div className="flex justify-between font-bold text-[13px] pt-1 border-t border-black mt-1"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          <div className="flex justify-between font-bold border-t border-black mt-1 pt-1"><span>Balance</span><span>{formatPrice(order.total)}</span></div>
        </div>
        <div className="text-center text-[11px] font-bold tracking-widest mt-4">THANK YOU</div>
        <div className="flex justify-center items-end gap-[1.5px] h-10 mt-3">{Array.from({ length: 34 }).map((_, index) => <div key={index} style={{ width: index % 3 === 0 ? 2 : 1, background: "#000", height: index % 5 === 0 ? "100%" : "80%" }} />)}</div>
        <div className="text-center text-[9px] tracking-[0.3em] mt-1">{order.order_number}</div>
      </div>
      <div className="receipt-torn-bottom" />
    </div>,
    document.body
  );
}
