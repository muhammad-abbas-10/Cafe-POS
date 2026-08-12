import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { sizesFor } from "@/lib/cafeData";
import { fetchSettings } from "@/lib/catalogStore";

const CartContext = createContext(null);

const uid = () => Math.random().toString(36).slice(2, 10);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [orderType, setOrderType] = useState("dine-in"); // dine-in | takeaway | delivery
  const [table, setTable] = useState("");
  const [billDiscount, setBillDiscount] = useState(null); // { code, type, value }
  const [taxRate, setTaxRate] = useState(0);
  const [deliveryFeeSetting, setDeliveryFeeSetting] = useState(0);

  React.useEffect(() => {
    fetchSettings().then((rows) => {
      const values = Object.fromEntries(rows.map((row) => [row.key, row.value]));
      setTaxRate(Number(values.tax_rate) || 0);
      setDeliveryFeeSetting(Number(values.delivery_fee) || 0);
    }).catch(() => {});
  }, []);

  const addItem = useCallback((entry) => {
    const line = {
      lineId: uid(),
      itemId: entry.itemId,
      name: entry.name,
      image: entry.image,
      basePrice: entry.basePrice,
      size: entry.size,
      sizeDelta: entry.sizeDelta,
      temperature: entry.temperature, // hot | iced
      sugar: entry.sugar,
      ice: entry.ice,
      addons: entry.addons || [],
      note: entry.note || "",
      qty: entry.qty || 1,
    };
    line.unitPrice =
      line.basePrice + (line.sizeDelta || 0) + line.addons.reduce((s, a) => s + a.price, 0);
    line.lineTotal = line.unitPrice * line.qty;
    setItems((prev) => [...prev, line]);
  }, []);

  const updateLine = useCallback((lineId, patch) => {
    setItems((prev) =>
      prev.map((l) => {
        if (l.lineId !== lineId) return l;
        const next = { ...l, ...patch };
        next.unitPrice =
          next.basePrice + (next.sizeDelta || 0) + (next.addons || []).reduce((s, a) => s + a.price, 0);
        next.lineTotal = next.unitPrice * next.qty;
        return next;
      })
    );
  }, []);

  const removeLine = useCallback((lineId) => {
    setItems((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const setLineNote = useCallback((lineId, note) => {
    setItems((prev) => prev.map((l) => (l.lineId === lineId ? { ...l, note } : l)));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setBillDiscount(null);
    setTable("");
    setOrderType("dine-in");
  }, []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, l) => s + l.lineTotal, 0);
    let discountAmount = 0;
    if (billDiscount) {
      discountAmount =
        billDiscount.type === "percent"
          ? (subtotal * billDiscount.value) / 100
          : Math.min(billDiscount.value, subtotal);
    }
    const deliveryFee = orderType === "delivery" ? deliveryFeeSetting : 0;
    const taxedBase = subtotal - discountAmount + deliveryFee;
    const tax = taxedBase * (taxRate / 100);
    const total = taxedBase + tax;
    return { subtotal, discountAmount, deliveryFee, tax, total };
  }, [items, billDiscount, orderType, taxRate, deliveryFeeSetting]);

  const value = {
    items, addItem, updateLine, removeLine, setLineNote, clear,
    orderType, setOrderType, table, setTable,
    billDiscount, setBillDiscount,
    totals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { sizesFor };
