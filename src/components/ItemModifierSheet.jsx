import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Minus, Check } from "lucide-react";
import { sizesFor, ADDONS, SUGAR_OPTIONS, ICE_OPTIONS, formatPrice } from "@/lib/cafeData";

export default function ItemModifierSheet({ item, onClose, onAdd }) {
  const sizes = sizesFor(item);
  const [size, setSize] = useState(sizes[Math.min(1, sizes.length - 1)]);
  const [temp, setTemp] = useState(item.drink ? "hot" : "n/a");
  const [sugar, setSugar] = useState("50%");
  const [ice, setIce] = useState("Regular");
  const [addons, setAddons] = useState([]);
  const [qty, setQty] = useState(1);

  const toggleAddon = (a) => {
    setAddons((prev) => (prev.find((x) => x.id === a.id) ? prev.filter((x) => x.id !== a.id) : [...prev, a]));
  };

  const unit = item.price + (size.delta || 0) + addons.reduce((s, a) => s + a.price, 0);

  const handleAdd = () => {
    onAdd({
      itemId: item.id,
      name: item.name,
      icon: item.icon,
      basePrice: item.price,
      size,
      sizeDelta: size.delta || 0,
      temperature: item.drink ? temp : undefined,
      sugar: item.drink ? sugar : undefined,
      ice: item.drink && temp === "iced" ? ice : undefined,
      addons,
      qty,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[hsl(var(--card))] w-full sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar rounded-t-[16px] sm:rounded-[12px] border border-[hsl(var(--border))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[10px] bg-[hsl(var(--muted))] flex items-center justify-center text-2xl">{item.icon}</div>
            <div>
              <div className="text-[15px] font-medium">{item.name}</div>
              <div className="text-xs text-[hsl(var(--muted-foreground))]">{item.description}</div>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-[8px] border border-[hsl(var(--border))] flex items-center justify-center"><X size={16} strokeWidth={1.5} /></button>
        </div>

        <div className="p-5 space-y-5">
          {sizes.length > 1 && (
            <Section title="Size">
              <div className="flex gap-2">
                {sizes.map((s) => (
                  <button key={s.id} onClick={() => setSize(s)} className={`flex-1 h-11 rounded-[10px] border text-sm ${selected(size.id === s.id)}`}>
                    <div>{s.name}</div>
                    {s.delta > 0 && <div className="text-[10px] text-[hsl(var(--muted-foreground))]">+{formatPrice(s.delta)}</div>}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {item.drink && (
            <Section title="Temperature">
              <div className="flex gap-2">
                {["hot", "iced"].map((t) => (
                  <button key={t} onClick={() => setTemp(t)} className={`flex-1 h-11 rounded-[10px] border text-sm capitalize ${selected(temp === t)}`}>{t}</button>
                ))}
              </div>
            </Section>
          )}

          {item.drink && (
            <Section title="Sugar">
              <div className="flex gap-2">
                {SUGAR_OPTIONS.map((s) => (
                  <button key={s} onClick={() => setSugar(s)} className={`flex-1 h-10 rounded-[10px] border text-xs ${selected(sugar === s)}`}>{s}</button>
                ))}
              </div>
            </Section>
          )}

          {item.drink && temp === "iced" && (
            <Section title="Ice">
              <div className="flex gap-2">
                {ICE_OPTIONS.map((i) => (
                  <button key={i} onClick={() => setIce(i)} className={`flex-1 h-10 rounded-[10px] border text-xs ${selected(ice === i)}`}>{i}</button>
                ))}
              </div>
            </Section>
          )}

          <Section title="Add-ons">
            <div className="space-y-2">
              {ADDONS.map((a) => {
                const on = !!addons.find((x) => x.id === a.id);
                return (
                  <button key={a.id} onClick={() => toggleAddon(a)} className="w-full flex items-center justify-between p-3 rounded-[10px] border border-[hsl(var(--border))]">
                    <span className="text-sm">{a.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">+{formatPrice(a.price)}</span>
                      <span className={`w-5 h-5 rounded-md border flex items-center justify-center ${on ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))]" : "border-[hsl(var(--border))]"}`}>
                        {on && <Check size={13} strokeWidth={2} className="text-white" />}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Quantity">
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-11 rounded-[10px] border border-[hsl(var(--border))] flex items-center justify-center"><Minus size={16} strokeWidth={1.5} /></button>
              <span className="text-lg font-medium w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-11 h-11 rounded-[10px] border border-[hsl(var(--border))] flex items-center justify-center"><Plus size={16} strokeWidth={1.5} /></button>
              <div className="ml-auto text-right">
                <div className="text-xs text-[hsl(var(--muted-foreground))]">Line total</div>
                <div className="text-[20px] font-medium text-[hsl(var(--primary))]">{formatPrice(unit * qty)}</div>
              </div>
            </div>
          </Section>
        </div>

        <div className="p-5 border-t border-[hsl(var(--border))]">
          <button onClick={handleAdd} className="w-full h-12 rounded-[10px] bg-[hsl(var(--primary))] text-white text-sm font-medium">Add to bill · {formatPrice(unit * qty)}</button>
        </div>
      </motion.div>
    </div>
  );
}

const selected = (is) =>
  is ? "bg-[hsl(var(--secondary))] border-[hsl(var(--secondary))] text-[hsl(var(--accent))]" : "border-[hsl(var(--border))] text-[hsl(var(--foreground))]";

function Section({ title, children }) {
  return (
    <div>
      <div className="text-[13px] text-[hsl(var(--muted-foreground))] mb-2">{title}</div>
      {children}
    </div>
  );
}