import React from "react";
import { createPortal } from "react-dom";
import { formatPrice } from "@/lib/cafeData";

const ORDER_TYPES = { "dine-in": "Dine-in", takeaway: "Takeaway", delivery: "Delivery" };
export default function Receipt({ order }) {
  if (!order) return null;
  const payments = order.payment_details?.payments || [];
  return createPortal(<div className="receipt-print hidden"><div className="receipt-paper mx-auto bg-white text-black font-mono px-5 pt-2 pb-4"><div className="text-center font-bold">{order.biz_name || ""}</div>{(order.biz_address || order.biz_phone) && <div className="text-center text-[10px]">{order.biz_address && <div>{order.biz_address}</div>}{order.biz_phone && <div>{order.biz_phone}</div>}</div>}<div className="text-[10px] mt-3">Order: {order.order_number} · {ORDER_TYPES[order.order_type] || order.order_type}</div><div className="mt-3 border-t border-dashed border-black pt-2 space-y-1">{order.items.map((line, index) => <div key={index} className="flex justify-between text-[11px]"><span>{line.qty}× {line.name}</span><span>{formatPrice(line.lineTotal)}</span></div>)}</div><div className="mt-3 border-t border-dashed border-black pt-2 space-y-1 text-[11px]"><div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>{order.delivery_fee > 0 && <div className="flex justify-between"><span>Delivery fee</span><span>{formatPrice(order.delivery_fee)}</span></div>}<div className="flex justify-between"><span>Sales Tax</span><span>{formatPrice(order.tax)}</span></div><div className="flex justify-between font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div>{payments.map((payment, index) => <div key={`${payment.method}-${index}`} className="flex justify-between"><span>{payment.method}</span><span>{formatPrice(payment.amount)}</span></div>)}</div></div></div>, document.body);
}
