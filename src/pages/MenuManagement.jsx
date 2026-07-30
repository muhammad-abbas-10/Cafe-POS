import React, { useState } from "react";
import { Plus, Pencil, Power, Trash2, X } from "lucide-react";
import { CATEGORIES, MENU_ITEMS, formatPrice } from "@/lib/cafeData";

export default function MenuManagement() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("pos_menu");
    return saved ? JSON.parse(saved) : MENU_ITEMS;
  });
  const [editing, setEditing] = useState(null);
  const [catFilter, setCatFilter] = useState("all");

  const persist = (next) => { setItems(next); localStorage.setItem("pos_menu", JSON.stringify(next)); };

  const toggleAvailable = (id) => persist(items.map((i) => (i.id === id ? { ...i, available: !i.available } : i)));
  const remove = (id) => persist(items.filter((i) => i.id !== id));
  const save = (item) => {
    if (items.find((i) => i.id === item.id)) persist(items.map((i) => (i.id === item.id ? item : i)));
    else persist([...items, item]);
    setEditing(null);
  };

  const visible = items.filter((i) => catFilter === "all" || i.category === catFilter);

  return (
    <div className="px-8 py-7">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[28px] font-medium">Menu & categories</h1>
        <button onClick={() => setEditing({ id: "mi-" + Date.now(), name: "", description: "", price: 0, category: "coffee", icon: "☕", available: true, drink: true })} className="h-10 px-4 rounded-[10px] bg-[hsl(var(--primary))] text-white text-sm font-medium flex items-center gap-1.5">
          <Plus size={16} strokeWidth={1.5} /> Add item
        </button>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {[{ id: "all", name: "All", icon: "✦" }, ...CATEGORIES].map((c) => (
          <button key={c.id} onClick={() => setCatFilter(c.id)} className={`shrink-0 h-9 px-3 rounded-[10px] border text-sm ${catFilter === c.id ? "bg-[hsl(var(--secondary))] border-[hsl(var(--secondary))] text-[hsl(var(--accent))]" : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"}`}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <div className="rounded-[12px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[12px] text-[hsl(var(--muted-foreground))] border-b border-[hsl(var(--border))]">
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((i) => (
              <tr key={i.id} className="border-b border-[hsl(var(--border))] last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2"><span className="text-lg">{i.icon}</span><div><div className="font-medium">{i.name}</div><div className="text-xs text-[hsl(var(--muted-foreground))]">{i.description}</div></div></div>
                </td>
                <td className="px-4 py-3 capitalize">{i.category}</td>
                <td className="px-4 py-3 text-[hsl(var(--accent))] font-medium">{formatPrice(i.price)}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 rounded-full ${i.available ? "bg-[#E3F0E7] text-[#3E7A4F]" : "bg-[#F8E3E3] text-[#A14B4B]"}`}>{i.available ? "Available" : "86'd"}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditing(i)} className="w-8 h-8 rounded-md border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))]" title="Edit"><Pencil size={15} strokeWidth={1.5} /></button>
                    <button onClick={() => toggleAvailable(i.id)} className="w-8 h-8 rounded-md border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))]" title="Toggle availability"><Power size={15} strokeWidth={1.5} /></button>
                    <button onClick={() => remove(i.id)} className="w-8 h-8 rounded-md border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))]" title="Delete"><Trash2 size={15} strokeWidth={1.5} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <ItemEditor item={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function ItemEditor({ item, onClose, onSave }) {
  const [form, setForm] = useState(item);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[hsl(var(--card))] w-full max-w-md rounded-[12px] border border-[hsl(var(--border))] p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">{item.name ? "Edit item" : "New item"}</div>
          <button onClick={onClose}><X size={18} strokeWidth={1.5} /></button>
        </div>
        <div className="space-y-3">
          <Field label="Name"><input value={form.name} onChange={(e) => set("name", e.target.value)} className="input" /></Field>
          <Field label="Description"><input value={form.description} onChange={(e) => set("description", e.target.value)} className="input" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price ($)"><input type="number" step="0.01" value={form.price} onChange={(e) => set("price", Number(e.target.value))} className="input" /></Field>
            <Field label="Icon (emoji)"><input value={form.icon} onChange={(e) => set("icon", e.target.value)} className="input" /></Field>
          </div>
          <Field label="Category">
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="input bg-transparent">
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.drink} onChange={(e) => set("drink", e.target.checked)} /> Has drink modifiers (size, sugar, ice)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.available} onChange={(e) => set("available", e.target.checked)} /> Available</label>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 h-10 rounded-[8px] border border-[hsl(var(--border))] text-sm">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 h-10 rounded-[8px] bg-[hsl(var(--primary))] text-white text-sm">Save</button>
        </div>
        <style>{`.input{width:100%;height:40px;border-radius:8px;border:1px solid hsl(var(--border));padding:0 12px;font-size:14px;background:transparent;outline:none}.input:focus{border-color:hsl(var(--primary))}`}</style>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div><label className="text-[13px] text-[hsl(var(--muted-foreground))]">{label}</label><div className="mt-1">{children}</div></div>;
}