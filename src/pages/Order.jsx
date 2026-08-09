import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Minus, Trash2, StickyNote, ArrowRight, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/cafeData";
import { fetchCategories, fetchItems } from "@/lib/catalogStore";
import { useCart } from "@/lib/CartContext";
import ItemModifierSheet from "@/components/ItemModifierSheet";

export default function Order() {
  const navigate = useNavigate();
  const { items, addItem, totals, orderType, setOrderType, table, setTable, removeLine, updateLine, setLineNote, billDiscount } = useCart();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [query, setQuery] = useState("");
  const [modifierItem, setModifierItem] = useState(null);
  const [noteFor, setNoteFor] = useState(null);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [cats, menu] = await Promise.all([fetchCategories(), fetchItems()]);
        if (cancelled) return;
        setCategories(cats);
        setMenuItems(menu);
        setActiveCat(cats[0]?.id ?? null);
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let list = menuItems.filter((m) => m.available);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
    } else {
      list = list.filter((m) => m.category === activeCat);
    }
    return list;
  }, [activeCat, menuItems, query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-sm text-[hsl(var(--muted-foreground))]">
        Loading menu…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen text-sm text-red-400">
        Couldn't load the menu: {loadError}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:h-screen">
      {/* Center column */}
      <div className="flex-1 flex flex-col md:overflow-hidden px-4 py-5 md:px-8 md:py-7">
        <div className="flex items-center justify-between gap-4 mb-5">
          <h1 className="text-[28px] font-medium text-[hsl(var(--foreground))]">Choose category</h1>
          <div className="relative w-72">
            <Search size={18} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items…"
              className="w-full h-11 pl-10 pr-4 rounded-[10px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--primary))]"
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
          {categories.map((c) => {
            const active = !query && activeCat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => { setQuery(""); setActiveCat(c.id); }}
                className={`shrink-0 h-14 px-4 rounded-[12px] flex items-center gap-2 border-2 transition-colors ${
                  active
                    ? "border-[hsl(var(--accent))] bg-[hsl(var(--secondary))] text-[hsl(var(--accent))]"
                    : "border-[#3A322C] bg-[hsl(var(--card))] text-[#F3EAE3] hover:bg-[hsl(var(--secondary))]"
                }`}
              >
                <span className="text-lg leading-none">{c.icon}</span>
                <span className="text-sm font-medium">{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* Item grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-24 md:pb-4">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setModifierItem(item)}
                className="text-left rounded-[16px] bg-[hsl(var(--card))] border border-[#3A322C] p-4 hover:border-[hsl(var(--primary))] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-[12px] object-cover shrink-0 bg-[hsl(var(--muted))]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-medium text-[#F3EAE3] truncate">{item.name}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))] line-clamp-1 mt-0.5">{item.description}</div>
                    <div className="text-[15px] font-medium text-[hsl(var(--primary))] mt-1.5">{formatPrice(item.price)}</div>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-sm text-[hsl(var(--muted-foreground))] py-12">No items match your search.</div>
            )}
          </div>
        </div>
      </div>

      {/* Right bill panel — single instance */}
      {mobileCartOpen && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setMobileCartOpen(false)} />
      )}
      <div
        className={`fixed md:static inset-x-0 bottom-0 md:inset-auto z-40 w-full md:w-[360px] md:shrink-0 border-l border-[#3A322C] bg-[hsl(var(--card))] flex flex-col max-h-[85vh] md:max-h-none rounded-t-2xl md:rounded-none transition-transform duration-300 ${mobileCartOpen ? "translate-y-0" : "translate-y-full"} md:translate-y-0`}
      >
        <div className="md:hidden flex items-center justify-center py-2">
          <div className="w-10 h-1 rounded-full bg-[hsl(var(--border))]" />
        </div>
        <div className="p-5 pb-4 border-b border-[#3A322C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center text-[#F3EAE3] font-medium">CM</div>
            <div>
              <div className="text-sm font-medium text-[hsl(var(--foreground))]">Counter 1</div>
              <div className="text-xs text-[hsl(var(--muted-foreground))]">Cashier · Live session</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[{ id: "dine-in", label: "Dine-in" }, { id: "takeaway", label: "Takeaway" }, { id: "delivery", label: "Delivery" }].map((type) => (
              <button
                key={type.id}
                onClick={() => setOrderType(type.id)}
                className={`h-9 rounded-[8px] text-xs font-medium border-2 transition-colors ${
                  orderType === type.id ? "border-[hsl(var(--accent))] bg-[hsl(var(--secondary))] text-[hsl(var(--accent))]" : "border-[#3A322C] text-[hsl(var(--muted-foreground))]"
                }`}
              >{type.label}</button>
            ))}
          </div>
          {orderType === "dine-in" && (
            <input
              value={table}
              onChange={(e) => setTable(e.target.value)}
              placeholder="Table number"
              className="w-full h-9 mt-2 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm focus:outline-none focus:border-[hsl(var(--primary))]"
            />
          )}
          {orderType === "delivery" && (
            <input
              value={table}
              onChange={(e) => setTable(e.target.value)}
              placeholder="Delivery address"
              className="w-full h-9 mt-2 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm focus:outline-none focus:border-[hsl(var(--primary))]"
            />
          )}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-3">
          {items.length === 0 && (
            <div className="min-h-full flex flex-col items-center justify-center text-center gap-3">
              <ShoppingBag size={28} strokeWidth={1.5} className="text-[#A89C8E]" />
              <span className="text-sm text-[hsl(var(--muted-foreground))]">Tap an item to start building the bill.</span>
            </div>
          )}
          {items.map((line) => (
            <div key={line.lineId} className="rounded-[12px] border border-[hsl(var(--border))] p-3">
              <div className="flex items-start gap-2">
                <img src={line.image} alt={line.name} className="w-10 h-10 rounded-[8px] object-cover shrink-0 bg-[hsl(var(--muted))]" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[hsl(var(--foreground))]">{line.name}</div>
                  <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">
                    {[line.size && line.size.name, line.temperature, line.sugar, line.ice].filter(Boolean).join(" · ")}
                  </div>
                  {line.addons.length > 0 && (
                    <div className="text-[11px] text-[hsl(var(--muted-foreground))]">+ {line.addons.map((a) => a.name).join(", ")}</div>
                  )}
                  {line.note && <div className="text-[11px] text-[hsl(var(--accent))] mt-1 italic">"{line.note}"</div>}
                </div>
                <div className="text-sm font-medium text-[hsl(var(--foreground))]">{formatPrice(line.lineTotal)}</div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <button onClick={() => updateLine(line.lineId, { qty: Math.max(1, line.qty - 1) })} className="w-7 h-7 rounded-md border border-[hsl(var(--border))] flex items-center justify-center"><Minus size={14} strokeWidth={1.5} /></button>
                  <span className="text-sm w-6 text-center">{line.qty}</span>
                  <button onClick={() => updateLine(line.lineId, { qty: line.qty + 1 })} className="w-7 h-7 rounded-md border border-[hsl(var(--border))] flex items-center justify-center"><Plus size={14} strokeWidth={1.5} /></button>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setNoteFor(line)} className="w-7 h-7 rounded-md border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))]" title="Add note"><StickyNote size={14} strokeWidth={1.5} /></button>
                  <button onClick={() => removeLine(line.lineId)} className="w-7 h-7 rounded-md border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))]" title="Remove"><Trash2 size={14} strokeWidth={1.5} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-[#3A322C] space-y-2">
          <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
          {totals.deliveryFee > 0 && <Row label="Delivery fee" value={formatPrice(totals.deliveryFee)} />}
          {billDiscount && <Row label={`Discount (${billDiscount.code})`} value={`−${formatPrice(totals.discountAmount)}`} accent />}
          <Row label="Tax (8%)" value={formatPrice(totals.tax)} muted />
          <div className="flex items-center justify-between pt-2 border-t border-[#3A322C]">
            <span className="text-sm font-medium text-[#F3EAE3]">Total</span>
            <span className="text-[22px] font-medium text-[#F3EAE3]">{formatPrice(totals.total)}</span>
          </div>
          <button
            onClick={() => { setMobileCartOpen(false); navigate("/payment"); }}
            disabled={items.length === 0}
            className="w-full h-12 rounded-[10px] bg-[hsl(var(--primary))] text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-40 mt-2 hover:opacity-90 transition-opacity"
          >
            Send to payment <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {!mobileCartOpen && items.length > 0 && (
        <button
          onClick={() => setMobileCartOpen(true)}
          className="md:hidden fixed bottom-4 right-4 z-30 h-14 px-5 rounded-full bg-[hsl(var(--primary))] text-white text-sm font-medium flex items-center gap-2 shadow-lg"
        >
          <ShoppingBag size={18} strokeWidth={1.5} />
          {items.length} item{items.length > 1 ? "s" : ""} · {formatPrice(totals.total)}
        </button>
      )}

      {modifierItem && (
        <ItemModifierSheet item={modifierItem} onClose={() => setModifierItem(null)} onAdd={(entry) => { addItem(entry); setModifierItem(null); }} />
      )}
      {noteFor && (
        <NoteModal line={noteFor} onClose={() => setNoteFor(null)} onSave={(t) => { setLineNote(noteFor.lineId, t); setNoteFor(null); }} />
      )}
    </div>
  );
}

function Row({ label, value, muted, accent }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-[hsl(var(--muted-foreground))]">{label}</span>
      <span className={`text-sm ${accent ? "text-[hsl(var(--accent))]" : muted ? "text-[hsl(var(--muted-foreground))]" : "text-[#F3EAE3]"}`}>{value}</span>
    </div>
  );
}

function NoteModal({ line, onClose, onSave }) {
  const [text, setText] = useState(line.note || "");
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-[hsl(var(--card))] w-full sm:max-w-md rounded-t-[16px] sm:rounded-[12px] border border-[hsl(var(--border))] p-5" onClick={(e) => e.stopPropagation()}>
        <div className="text-sm font-medium mb-3">Note for {line.name}</div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="e.g. no whipped cream" className="w-full rounded-[8px] border border-[hsl(var(--border))] p-3 text-sm focus:outline-none focus:border-[hsl(var(--primary))]" />
        <div className="flex gap-2 mt-3">
          <button onClick={onClose} className="flex-1 h-10 rounded-[8px] border border-[hsl(var(--border))] text-sm">Cancel</button>
          <button onClick={() => onSave(text)} className="flex-1 h-10 rounded-[8px] bg-[hsl(var(--primary))] text-white text-sm">Save note</button>
        </div>
      </div>
    </div>
  );
}