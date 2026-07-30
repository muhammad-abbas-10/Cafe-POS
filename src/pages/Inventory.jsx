import React, { useState } from "react";
import { AlertTriangle, Plus, Minus, History } from "lucide-react";
import { INGREDIENTS, formatPrice } from "@/lib/cafeData";
import { MENU_ITEMS } from "@/lib/cafeData";

export default function Inventory() {
  const [stock, setStock] = useState(() => {
    const saved = localStorage.getItem("pos_stock");
    return saved ? JSON.parse(saved) : INGREDIENTS;
  });
  const [adjusting, setAdjusting] = useState(null);
  const [log, setLog] = useState(() => {
    const saved = localStorage.getItem("pos_stock_log");
    return saved ? JSON.parse(saved) : [];
  });

  const persist = (next) => {
    setStock(next);
    localStorage.setItem("pos_stock", JSON.stringify(next));
  };

  const adjust = (id, delta, reason) => {
    const ing = stock.find((s) => s.id === id);
    const oldVal = ing.stock;
    const next = stock.map((s) => (s.id === id ? { ...s, stock: Math.max(0, +(s.stock + delta).toFixed(2)) } : s));
    persist(next);
    setLog((prev) => [{ who: "Manager", when: new Date().toISOString(), name: ing.name, old: oldVal, new: +(oldVal + delta).toFixed(2), reason }, ...prev].slice(0, 50));
    localStorage.setItem("pos_stock_log", JSON.stringify(log));
    setAdjusting(null);
  };

  const lowCount = stock.filter((s) => s.stock < s.threshold).length;

  return (
    <div className="px-8 py-7">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[28px] font-medium">Inventory & stock</h1>
        <span className="text-xs text-[hsl(var(--muted-foreground))]">{lowCount} low-stock item{lowCount !== 1 ? "s" : ""}</span>
      </div>

      {lowCount > 0 && (
        <div className="flex items-center gap-2 mb-4 rounded-[12px] border border-[#E8C9A8] bg-[#FBE9D5] px-4 py-3">
          <AlertTriangle size={18} strokeWidth={1.5} className="text-[#C46A1A]" />
          <span className="text-sm text-[#C46A1A]">Some ingredients are below their reorder threshold.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[12px] text-[hsl(var(--muted-foreground))] border-b border-[hsl(var(--border))]">
                <th className="px-4 py-3 font-medium">Ingredient</th>
                <th className="px-4 py-3 font-medium">In stock</th>
                <th className="px-4 py-3 font-medium">Threshold</th>
                <th className="px-4 py-3 font-medium">Linked items</th>
                <th className="px-4 py-3 font-medium text-right">Adjust</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((s) => {
                const low = s.stock < s.threshold;
                const linkedNames = s.linked.map((id) => MENU_ITEMS.find((m) => m.id === id)?.name).filter(Boolean);
                return (
                  <tr key={s.id} className="border-b border-[hsl(var(--border))] last:border-0">
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3">
                      <span className={low ? "text-[#C46A1A] font-medium" : ""}>{s.stock} {s.unit}</span>
                      {low && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-[#F8E3E3] text-[#A14B4B]">Low</span>}
                    </td>
                    <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{s.threshold} {s.unit}</td>
                    <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))]">{linkedNames.length ? linkedNames.join(", ") : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => adjust(s.id, -1, "Wastage")} className="w-8 h-8 rounded-md border border-[hsl(var(--border))] flex items-center justify-center"><Minus size={15} strokeWidth={1.5} /></button>
                        <button onClick={() => setAdjusting(s)} className="w-8 h-8 rounded-md border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))]" title="Adjust"><History size={15} strokeWidth={1.5} /></button>
                        <button onClick={() => adjust(s.id, 1, "Delivery received")} className="w-8 h-8 rounded-md border border-[hsl(var(--border))] flex items-center justify-center"><Plus size={15} strokeWidth={1.5} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5">
          <div className="text-sm font-medium mb-3">Audit trail</div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto no-scrollbar">
            {log.length === 0 && <div className="text-xs text-[hsl(var(--muted-foreground))]">No adjustments yet.</div>}
            {log.map((l, i) => (
              <div key={i} className="text-xs border-l-2 border-[hsl(var(--border))] pl-3">
                <div className="font-medium text-[hsl(var(--foreground))]">{l.name}: {l.old} → {l.new}</div>
                <div className="text-[hsl(var(--muted-foreground))]">{l.reason} · {l.who}</div>
                <div className="text-[hsl(var(--muted-foreground))]">{new Date(l.when).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {adjusting && (
        <AdjustModal ing={adjusting} onClose={() => setAdjusting(null)} onSubmit={(delta, reason) => adjust(adjusting.id, delta, reason)} />
      )}
    </div>
  );
}

function AdjustModal({ ing, onClose, onSubmit }) {
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState("Correction");
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[hsl(var(--card))] w-full max-w-sm rounded-[12px] border border-[hsl(var(--border))] p-5" onClick={(e) => e.stopPropagation()}>
        <div className="text-sm font-medium mb-1">Adjust {ing.name}</div>
        <div className="text-xs text-[hsl(var(--muted-foreground))] mb-4">Current: {ing.stock} {ing.unit}</div>
        <label className="text-[13px] text-[hsl(var(--muted-foreground))]">Change (+/−)</label>
        <input type="number" step="0.1" value={delta} onChange={(e) => setDelta(Number(e.target.value))} className="w-full h-10 mt-1 mb-3 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" />
        <label className="text-[13px] text-[hsl(var(--muted-foreground))]">Reason</label>
        <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full h-10 mt-1 mb-4 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm bg-transparent">
          <option>Delivery received</option><option>Wastage</option><option>Correction</option><option>Stocktake</option>
        </select>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 h-10 rounded-[8px] border border-[hsl(var(--border))] text-sm">Cancel</button>
          <button onClick={() => onSubmit(delta, reason)} className="flex-1 h-10 rounded-[8px] bg-[hsl(var(--primary))] text-white text-sm">Save</button>
        </div>
      </div>
    </div>
  );
}