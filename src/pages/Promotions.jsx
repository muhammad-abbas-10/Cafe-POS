import React, { useState } from "react";
import { Plus, Ticket, Gift, Star, X } from "lucide-react";
import { PROMOTIONS } from "@/lib/cafeData";

export default function Promotions() {
  const [promos, setPromos] = useState(() => {
    const saved = localStorage.getItem("pos_promos");
    return saved ? JSON.parse(saved) : PROMOTIONS;
  });
  const [editing, setEditing] = useState(null);
  const persist = (next) => { setPromos(next); localStorage.setItem("pos_promos", JSON.stringify(next)); };

  const toggle = (id) => persist(promos.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  const save = (p) => { persist(promos.find((x) => x.id === p.id) ? promos.map((x) => (x.id === p.id ? p : x)) : [...promos, p]); setEditing(null); };

  const loyalty = [
    { name: "Aria Patel", visits: 24, points: 240, reward: "Free coffee" },
    { name: "Leo Marsh", visits: 11, points: 110, reward: "10% off" },
    { name: "Nina Costa", visits: 7, points: 70, reward: "—" },
  ];

  return (
    <div className="px-8 py-7">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[28px] font-medium">Promotions & loyalty</h1>
        <button onClick={() => setEditing({ id: "pr-" + Date.now(), code: "", description: "", type: "percent", value: 10, active: true, start: "2026-07-29", end: "2026-12-31" })} className="h-10 px-4 rounded-[10px] bg-[hsl(var(--primary))] text-white text-sm font-medium flex items-center gap-1.5">
          <Plus size={16} strokeWidth={1.5} /> New promo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <div className="text-sm font-medium mb-3 flex items-center gap-2"><Ticket size={16} strokeWidth={1.5} className="text-[hsl(var(--accent))]" /> Discount codes</div>
          <div className="space-y-3">
            {promos.map((p) => (
              <div key={p.id} className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium tracking-wide">{p.code}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.active ? "bg-[#E3F0E7] text-[#3E7A4F]" : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"}`}>{p.active ? "Active" : "Paused"}</span>
                  </div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{p.description}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{p.type === "percent" ? `${p.value}% off` : `$${p.value} off`} · {p.start} → {p.end}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(p)} className="h-8 px-3 rounded-[8px] border border-[hsl(var(--border))] text-xs">Edit</button>
                  <button onClick={() => toggle(p.id)} className={`h-8 px-3 rounded-[8px] border text-xs ${p.active ? "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]" : "border-[hsl(var(--primary))] text-[hsl(var(--primary))]"}`}>{p.active ? "Pause" : "Resume"}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-3 flex items-center gap-2"><Star size={16} strokeWidth={1.5} className="text-[hsl(var(--accent))]" /> Loyalty members</div>
          <div className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[12px] text-[hsl(var(--muted-foreground))] border-b border-[hsl(var(--border))]">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Visits</th>
                  <th className="px-4 py-3 font-medium">Points</th>
                  <th className="px-4 py-3 font-medium">Reward</th>
                </tr>
              </thead>
              <tbody>
                {loyalty.map((m) => (
                  <tr key={m.name} className="border-b border-[hsl(var(--border))] last:border-0">
                    <td className="px-4 py-3 font-medium">{m.name}</td>
                    <td className="px-4 py-3">{m.visits}</td>
                    <td className="px-4 py-3 text-[hsl(var(--accent))] font-medium">{m.points}</td>
                    <td className="px-4 py-3 text-xs">{m.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-[12px] bg-[hsl(var(--secondary))] border border-[hsl(var(--secondary))] p-4 mt-3 flex items-center gap-3">
            <Gift size={20} strokeWidth={1.5} className="text-[hsl(var(--accent))]" />
            <div className="text-xs text-[hsl(var(--accent))]">10 points per visit · 100 points = free coffee · 250 points = free meal</div>
          </div>
        </div>
      </div>

      {editing && <PromoEditor promo={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function PromoEditor({ promo, onClose, onSave }) {
  const [form, setForm] = useState(promo);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[hsl(var(--card))] w-full max-w-sm rounded-[12px] border border-[hsl(var(--border))] p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4"><div className="text-sm font-medium">{promo.code ? "Edit promo" : "New promo"}</div><button onClick={onClose}><X size={18} strokeWidth={1.5} /></button></div>
        <div className="space-y-3">
          <div><label className="text-[13px] text-[hsl(var(--muted-foreground))]">Code</label><input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} className="w-full h-10 mt-1 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" /></div>
          <div><label className="text-[13px] text-[hsl(var(--muted-foreground))]">Description</label><input value={form.description} onChange={(e) => set("description", e.target.value)} className="w-full h-10 mt-1 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[13px] text-[hsl(var(--muted-foreground))]">Type</label><select value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full h-10 mt-1 px-2 rounded-[8px] border border-[hsl(var(--border))] text-sm bg-transparent"><option value="percent">Percent</option><option value="fixed">Fixed $</option></select></div>
            <div><label className="text-[13px] text-[hsl(var(--muted-foreground))]">Value</label><input type="number" value={form.value} onChange={(e) => set("value", Number(e.target.value))} className="w-full h-10 mt-1 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[13px] text-[hsl(var(--muted-foreground))]">Start</label><input value={form.start} onChange={(e) => set("start", e.target.value)} className="w-full h-10 mt-1 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" /></div>
            <div><label className="text-[13px] text-[hsl(var(--muted-foreground))]">End</label><input value={form.end} onChange={(e) => set("end", e.target.value)} className="w-full h-10 mt-1 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" /></div>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} /> Active</label>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 h-10 rounded-[8px] border border-[hsl(var(--border))] text-sm">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 h-10 rounded-[8px] bg-[hsl(var(--primary))] text-white text-sm">Save</button>
        </div>
      </div>
    </div>
  );
}