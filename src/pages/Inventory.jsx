import React, { useEffect, useState } from "react";
import { AlertTriangle, History, Minus, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  createAdjustment,
  createIngredient,
  deleteIngredient,
  fetchAdjustments,
  fetchIngredients,
  updateIngredient,
} from "@/lib/catalogStore";

export default function Inventory() {
  const [stock, setStock] = useState([]);
  const [log, setLog] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInventory() {
      try {
        const ingredients = await fetchIngredients();
        if (cancelled) return;
        setStock(ingredients);
        setError("");

        try {
          const adjustments = await fetchAdjustments();
          if (!cancelled) setLog(adjustments);
        } catch {
          if (!cancelled) setLog([]);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInventory();
    return () => {
      cancelled = true;
    };
  }, []);

  const addIngredient = async (ingredient) => {
    const created = await createIngredient(ingredient);
    setStock((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
    setAdding(false);
  };

  const saveIngredient = async (ingredient) => {
    const updated = await updateIngredient(ingredient.id, ingredient);
    setStock((current) =>
      current
        .map((item) => (item.id === updated.id ? updated : item))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    setEditing(null);
  };

  const removeIngredient = async (ingredient) => {
    if (!confirm(`Remove ${ingredient.name} from inventory?`)) return;
    try {
      await deleteIngredient(ingredient.id);
      setStock((current) => current.filter((item) => item.id !== ingredient.id));
    } catch (err) {
      alert(err.message);
    }
  };

  const adjust = async (ingredient, delta, reason) => {
    if (!Number.isFinite(delta) || delta === 0) return;
    try {
      const entry = await createAdjustment({ ingredient_id: ingredient.id, delta, reason });
      setStock((current) =>
        current.map((item) =>
          item.id === ingredient.id
            ? { ...item, stock_qty: Number(item.stock_qty) + delta }
            : item
        )
      );
      setLog((current) => [entry, ...current].slice(0, 50));
      setAdjusting(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <PageMessage>Loading inventory...</PageMessage>;
  if (error) return <PageMessage error>Couldn't load inventory: {error}</PageMessage>;

  const lowCount = stock.filter((item) => Number(item.stock_qty) < Number(item.threshold)).length;

  return (
    <div className="px-8 py-7">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[28px] font-medium">Inventory & stock</h1>
          <div className="text-xs text-[hsl(var(--muted-foreground))]">
            {lowCount} low-stock item{lowCount === 1 ? "" : "s"}
          </div>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="h-10 px-4 rounded-[10px] bg-[hsl(var(--primary))] text-white text-sm font-medium flex items-center gap-1.5"
        >
          <Plus size={16} strokeWidth={1.5} /> Add ingredient
        </button>
      </div>

      {lowCount > 0 && (
        <div className="flex gap-2 mb-4 rounded-xl border border-[#5C4326] bg-[#3A2A16] px-4 py-3 text-sm text-[#E2954D]">
          <AlertTriangle size={18} /> Some ingredients are below their reorder threshold.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] overflow-hidden">
          {stock.length ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[hsl(var(--muted-foreground))] border-b">
                  <th className="px-4 py-3">Ingredient</th>
                  <th className="px-4 py-3">In stock</th>
                  <th className="px-4 py-3">Threshold</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((item) => {
                  const low = Number(item.stock_qty) < Number(item.threshold);
                  return (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className={`px-4 py-3 ${low ? "text-[#E2954D] font-medium" : ""}`}>
                        {item.stock_qty} {item.unit}
                        {low && <span className="ml-2 text-[10px]">Low</span>}
                      </td>
                      <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">
                        {item.threshold} {item.unit}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <IconButton title="Record wastage" onClick={() => adjust(item, -1, "Wastage")}>
                            <Minus size={15} />
                          </IconButton>
                          <IconButton title="Custom adjustment" onClick={() => setAdjusting(item)}>
                            <History size={15} />
                          </IconButton>
                          <IconButton title="Record delivery" onClick={() => adjust(item, 1, "Delivery received")}>
                            <Plus size={15} />
                          </IconButton>
                          <IconButton title="Edit ingredient" onClick={() => setEditing(item)}>
                            <Pencil size={15} />
                          </IconButton>
                          <IconButton title="Remove ingredient" onClick={() => removeIngredient(item)}>
                            <Trash2 size={15} />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <EmptyInventory onAdd={() => setAdding(true)} />
          )}
        </div>

        <div className="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5">
          <div className="text-sm font-medium mb-3">Audit trail</div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto">
            {log.length ? (
              log.map((entry) => (
                <div key={entry.id} className="text-xs border-l-2 border-[hsl(var(--border))] pl-3">
                  <div className="font-medium">
                    {stock.find((item) => item.id === entry.ingredient_id)?.name || "Ingredient"}:{" "}
                    {Number(entry.delta) > 0 ? "+" : ""}
                    {entry.delta}
                  </div>
                  <div>{entry.reason}</div>
                  <div className="text-[hsl(var(--muted-foreground))]">
                    {new Date(entry.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-[hsl(var(--muted-foreground))]">No adjustments yet.</div>
            )}
          </div>
        </div>
      </div>

      {adding && (
        <IngredientModal
          title="Add ingredient"
          onClose={() => setAdding(false)}
          onSubmit={addIngredient}
        />
      )}
      {editing && (
        <IngredientModal
          title="Edit ingredient"
          ingredient={editing}
          onClose={() => setEditing(null)}
          onSubmit={saveIngredient}
        />
      )}
      {adjusting && (
        <AdjustModal
          ingredient={adjusting}
          onClose={() => setAdjusting(null)}
          onSubmit={(delta, reason) => adjust(adjusting, delta, reason)}
        />
      )}
    </div>
  );
}

function EmptyInventory({ onAdd }) {
  return (
    <div className="px-5 py-10 text-center">
      <div className="text-sm font-medium">No stock items in the backend yet.</div>
      <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
        Add your first ingredient to start tracking inventory.
      </div>
      <button
        onClick={onAdd}
        className="mt-4 h-9 px-3 rounded-[8px] bg-[hsl(var(--primary))] text-white text-sm inline-flex items-center gap-1.5"
      >
        <Plus size={15} strokeWidth={1.5} /> Add ingredient
      </button>
    </div>
  );
}

function IngredientModal({ title, ingredient, onClose, onSubmit }) {
  const [form, setForm] = useState(
    ingredient ?? { name: "", unit: "pcs", stock_qty: 0, threshold: 0 }
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    try {
      setBusy(true);
      setError("");
      await onSubmit({
        ...form,
        name: form.name.trim(),
        unit: form.unit.trim(),
        stock_qty: Number(form.stock_qty),
        threshold: Number(form.threshold),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl bg-[hsl(var(--card))] p-5" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="font-medium">{title}</div>
          <button onClick={onClose} className="w-8 h-8 rounded border flex items-center justify-center">
            <X size={15} />
          </button>
        </div>
        {error && <div className="mb-3 text-xs text-red-400">{error}</div>}
        <Field label="Name">
          <input value={form.name} onChange={(event) => set("name", event.target.value)} className="input" />
        </Field>
        <Field label="Unit">
          <input value={form.unit} onChange={(event) => set("unit", event.target.value)} className="input" placeholder="pcs, kg, g, ml" />
        </Field>
        <Field label="Current stock">
          <input type="number" step="0.1" value={form.stock_qty} onChange={(event) => set("stock_qty", event.target.value)} className="input" />
        </Field>
        <Field label="Reorder threshold">
          <input type="number" step="0.1" value={form.threshold} onChange={(event) => set("threshold", event.target.value)} className="input" />
        </Field>
        <div className="flex gap-2 mt-4">
          <button className="flex-1 h-10 border rounded" onClick={onClose}>Cancel</button>
          <button className="flex-1 h-10 rounded bg-[hsl(var(--primary))] text-white disabled:opacity-50" disabled={busy} onClick={submit}>
            {busy ? "Saving..." : "Save"}
          </button>
        </div>
        <style>{`.input{width:100%;height:40px;border-radius:8px;border:1px solid hsl(var(--border));padding:0 12px;font-size:14px;background:transparent;color:hsl(var(--foreground));outline:none}.input:focus{border-color:hsl(var(--primary))}`}</style>
      </div>
    </div>
  );
}

function AdjustModal({ ingredient, onClose, onSubmit }) {
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState("Correction");

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center" onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl bg-[hsl(var(--card))] p-5" onClick={(event) => event.stopPropagation()}>
        <div className="font-medium">Adjust {ingredient.name}</div>
        <div className="text-xs mb-4">
          Current: {ingredient.stock_qty} {ingredient.unit}
        </div>
        <input aria-label="Stock change" type="number" step="0.1" value={delta} onChange={(event) => setDelta(Number(event.target.value))} className="w-full h-10 px-3 border rounded mb-3" />
        <select value={reason} onChange={(event) => setReason(event.target.value)} className="w-full h-10 px-3 border rounded mb-4">
          <option>Delivery received</option>
          <option>Wastage</option>
          <option>Correction</option>
          <option>Stocktake</option>
        </select>
        <div className="flex gap-2">
          <button className="flex-1 h-10 border rounded" onClick={onClose}>Cancel</button>
          <button className="flex-1 h-10 rounded bg-[hsl(var(--primary))] text-white" onClick={() => onSubmit(delta, reason)}>Save</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="text-[13px] text-[hsl(var(--muted-foreground))]">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function IconButton({ children, ...props }) {
  return (
    <button className="w-8 h-8 rounded border flex items-center justify-center" {...props}>
      {children}
    </button>
  );
}

function PageMessage({ children, error }) {
  return (
    <div className={`px-8 py-7 text-sm ${error ? "text-red-400" : "text-[hsl(var(--muted-foreground))]"}`}>
      {children}
    </div>
  );
}
