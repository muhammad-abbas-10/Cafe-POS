import React, { useState, useEffect } from "react";
import { Plus, Pencil, Power, Trash2, X, FolderPlus, Image as ImageIcon } from "lucide-react";
import { formatPrice } from "@/lib/cafeData";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  fetchIngredients,
  fetchItemIngredients,
  updateItemIngredients,
} from "@/lib/catalogStore";

const MAX_IMAGE_DIMENSION = 900;
const MAX_IMAGE_BYTES = 700 * 1024;
const IMAGE_QUALITY_STEPS = [0.82, 0.72, 0.62, 0.54];

function dataUrlBytes(dataUrl) {
  const base64 = dataUrl.split(",")[1] || "";
  return Math.ceil((base64.length * 3) / 4);
}

function imageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);

      const best = IMAGE_QUALITY_STEPS
        .map((quality) => canvas.toDataURL("image/jpeg", quality))
        .find((dataUrl) => dataUrlBytes(dataUrl) <= MAX_IMAGE_BYTES);

      if (best) {
        resolve(best);
      } else {
        reject(new Error("Image is too large. Please choose a smaller photo."));
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Couldn't read that image. Please choose another file."));
    };

    image.src = objectUrl;
  });
}

export default function MenuManagement() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [manageCats, setManageCats] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [cats, menu, ingredientRows] = await Promise.all([fetchCategories(), fetchItems(), fetchIngredients()]);
        if (cancelled) return;
        setCategories(cats);
        setItems(menu);
        setIngredients(ingredientRows);
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const toggleAvailable = async (id) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    try {
      const updated = await updateItem(id, { ...item, available: !item.available });
      setItems(items.map((i) => (i.id === id ? updated : i)));
    } catch (err) {
      alert(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteItem(id);
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const save = async (item) => {
    try {
      let saved;
      if (item.id) {
        saved = await updateItem(item.id, item);
        setItems(items.map((i) => (i.id === saved.id ? saved : i)));
      } else {
        saved = await createItem(item);
        setItems([...items, saved]);
      }
      await updateItemIngredients(saved.id, item.recipe || []);
      setEditing(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateCategory = async (name) => {
    const created = await createCategory({ name, sort_order: categories.length });
    setCategories([...categories, created]);
  };

  const handleRenameCategory = async (id, name) => {
    const existing = categories.find((c) => c.id === id);
    const updated = await updateCategory(id, { name, sort_order: existing?.sort_order ?? 0 });
    setCategories(categories.map((c) => (c.id === id ? updated : c)));
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
    setCategories(categories.filter((c) => c.id !== id));
  };

  const visible = items.filter((i) => catFilter === "all" || i.category === catFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-[hsl(var(--muted-foreground))]">
        Loading menu…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-red-400">
        Couldn't load the menu: {loadError}
      </div>
    );
  }

  return (
    <div className="px-8 py-7">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[28px] font-medium">Menu & categories</h1>
        <div className="flex gap-2">
          <button onClick={() => setManageCats(true)} className="h-10 px-4 rounded-[10px] border border-[hsl(var(--border))] text-sm font-medium flex items-center gap-1.5"><FolderPlus size={16} strokeWidth={1.5} /> Manage categories</button>
          <button
            onClick={() => setEditing({ id: null, name: "", description: "", price: 0, category: categories[0]?.id ?? "", image: "", available: true, drink: true })}
            disabled={categories.length === 0}
            className="h-10 px-4 rounded-[10px] bg-[hsl(var(--primary))] text-white text-sm font-medium flex items-center gap-1.5 disabled:opacity-40"
          >
            <Plus size={16} strokeWidth={1.5} /> Add item
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {[{ id: "all", name: "All" }, ...categories].map((c) => {
          const active = catFilter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCatFilter(c.id)}
              className={`shrink-0 h-9 px-3 rounded-[10px] border-2 text-sm flex items-center gap-1.5 transition-colors ${
                active ? "border-[hsl(var(--accent))] bg-[hsl(var(--secondary))] text-[hsl(var(--accent))]" : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
              }`}
            >
              {c.name}
            </button>
          );
        })}
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
                  <div className="flex items-center gap-2"><img src={i.image} alt={i.name} className="w-9 h-9 rounded-[8px] object-cover bg-[hsl(var(--muted))]" /><div><div className="font-medium">{i.name}</div><div className="text-xs text-[hsl(var(--muted-foreground))]">{i.description}</div></div></div>
                </td>
                <td className="px-4 py-3 capitalize">{categories.find((c) => c.id === i.category)?.name || i.category}</td>
                <td className="px-4 py-3 text-[hsl(var(--accent))] font-medium">{formatPrice(i.price)}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-1 rounded-full ${i.available ? "bg-[#173321] text-[#6FCB86]" : "bg-[#3A1F1F] text-[#E38585]"}`}>{i.available ? "Available" : "Unavailaible"}</span>
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

      {editing && <ItemEditor item={editing} categories={categories} ingredients={ingredients} onClose={() => setEditing(null)} onSave={save} />}
      {manageCats && (
        <CategoryManager
          categories={categories}
          items={items}
          onClose={() => setManageCats(false)}
          onCreate={handleCreateCategory}
          onRename={handleRenameCategory}
          onDelete={handleDeleteCategory}
        />
      )}
    </div>
  );
}

function CategoryManager({ categories, items, onClose, onCreate, onRename, onDelete }) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const startEditing = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const commitRename = async () => {
    const id = editingId;
    const name = editingName.trim();
    setEditingId(null);
    if (!id || !name) return;
    try {
      setBusy(true);
      setError(null);
      await onRename(id, name);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const addCategory = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      setBusy(true);
      setError(null);
      await onCreate(name);
      setNewName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const removeCategory = async (id) => {
    const inUse = items.filter((item) => item.category === id).length;
    if (inUse > 0 && !confirm(`${inUse} item(s) use this category. Delete anyway?`)) return;
    try {
      setBusy(true);
      setError(null);
      await onDelete(id);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[hsl(var(--card))] w-full max-w-md rounded-[12px] border border-[hsl(var(--border))] p-5" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-4"><div className="text-sm font-medium">Edit or delete categories</div><button onClick={onClose}><X size={18} strokeWidth={1.5} /></button></div>
        {error && <div className="text-xs text-red-400 mb-2">{error}</div>}
        <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar mb-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <div className="flex-1 h-9 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm flex items-center">
                {editingId === category.id ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(event) => event.key === "Enter" && commitRename()}
                    className="w-full bg-transparent outline-none text-[hsl(var(--foreground))]"
                  />
                ) : category.name}
              </div>
              <button onClick={() => startEditing(category)} disabled={busy} className="w-9 h-9 rounded-[8px] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] disabled:opacity-40" title="Edit category"><Pencil size={15} strokeWidth={1.5} /></button>
              <button onClick={() => removeCategory(category.id)} disabled={busy} className="w-9 h-9 rounded-[8px] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] disabled:opacity-40" title="Delete category"><Trash2 size={15} strokeWidth={1.5} /></button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="New category name" className="flex-1 h-9 px-3 rounded-[8px] border border-[hsl(var(--border))] text-sm" />
          <button onClick={addCategory} disabled={busy} className="h-9 px-3 rounded-[8px] bg-[hsl(var(--primary))] text-white text-sm flex items-center gap-1 disabled:opacity-40"><Plus size={15} strokeWidth={1.5} /> Add</button>
        </div>
        <button onClick={onClose} className="w-full h-10 rounded-[8px] border border-[hsl(var(--border))] text-sm">Done</button>
      </div>
    </div>
  );
}

function ItemEditor({ item, categories, ingredients, onClose, onSave }) {
  const [form, setForm] = useState(item);
  const [recipe, setRecipe] = useState([]);
  const [recipeBusy, setRecipeBusy] = useState(Boolean(item.id));
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  useEffect(() => {
    if (!item.id) return;
    let cancelled = false;
    fetchItemIngredients(item.id)
      .then((rows) => { if (!cancelled) setRecipe(rows.map((row) => ({ ingredient_id: row.ingredient_id, quantity: Number(row.quantity) }))); })
      .catch((err) => { if (!cancelled) setImageError(`Couldn't load recipe: ${err.message}`); })
      .finally(() => { if (!cancelled) setRecipeBusy(false); });
    return () => { cancelled = true; };
  }, [item.id]);
  const setRecipeQuantity = (ingredientId, value) => {
    const quantity = Number(value);
    setRecipe((current) => {
      const without = current.filter((row) => row.ingredient_id !== ingredientId);
      return quantity > 0 ? [...without, { ingredient_id: ingredientId, quantity }] : without;
    });
  };
  const handleImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImageBusy(true);
      setImageError(null);
      set("image", await imageToDataUrl(file));
    } catch (err) {
      setImageError(err.message);
      event.target.value = "";
    } finally {
      setImageBusy(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[hsl(var(--card))] w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar rounded-[12px] border border-[hsl(var(--border))] p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">{item.id ? "Edit item" : "New item"}</div>
          <button onClick={onClose}><X size={18} strokeWidth={1.5} /></button>
        </div>
        <div className="space-y-3">
          <Field label="Photo"><div className="flex items-center gap-3"><div className="w-16 h-16 rounded-[10px] bg-[hsl(var(--muted))] overflow-hidden flex items-center justify-center shrink-0">{form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={20} strokeWidth={1.5} className="text-[hsl(var(--muted-foreground))]" />}</div><div><label className={`h-9 px-3 rounded-[8px] border border-[hsl(var(--border))] text-xs flex items-center gap-1.5 ${imageBusy ? "opacity-60 cursor-wait" : "cursor-pointer"}`}><ImageIcon size={14} strokeWidth={1.5} /> {imageBusy ? "Preparing..." : "Choose photo"}<input type="file" accept="image/*" onChange={handleImage} disabled={imageBusy} className="hidden" /></label>{imageError && <div className="mt-1 text-xs text-red-400">{imageError}</div>}</div></div></Field>
          <Field label="Name"><input value={form.name} onChange={(e) => set("name", e.target.value)} className="input" /></Field>
          <Field label="Description"><input value={form.description} onChange={(e) => set("description", e.target.value)} className="input" /></Field>
          <Field label="Price (Rs)"><input type="number" step="0.01" value={form.price} onChange={(e) => set("price", Number(e.target.value))} className="input" /></Field>
          <Field label="Category"><select value={form.category} onChange={(e) => set("category", e.target.value)} className="input category-select">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.drink} onChange={(e) => set("drink", e.target.checked)} /> Has drink modifiers</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.available} onChange={(e) => set("available", e.target.checked)} /> Available</label>
          <Field label="Recipe (quantity used per item)">
            {recipeBusy ? <div className="text-xs text-[hsl(var(--muted-foreground))]">Loading recipe...</div> : (
              <div className="space-y-2 max-h-44 overflow-y-auto no-scrollbar">
                {ingredients.length === 0 && <div className="text-xs text-[hsl(var(--muted-foreground))]">Add ingredients in Stock first.</div>}
                {ingredients.map((ingredient) => (
                  <label key={ingredient.id} className="flex items-center gap-2 text-sm">
                    <span className="flex-1">{ingredient.name}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      value={recipe.find((row) => row.ingredient_id === ingredient.id)?.quantity || ""}
                      onChange={(event) => setRecipeQuantity(ingredient.id, event.target.value)}
                      placeholder="0"
                      className="input !w-24"
                    />
                    <span className="w-10 text-xs text-[hsl(var(--muted-foreground))]">{ingredient.unit}</span>
                  </label>
                ))}
              </div>
            )}
          </Field>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 h-10 rounded-[8px] border border-[hsl(var(--border))] text-sm">Cancel</button>
          <button onClick={() => onSave({ ...form, recipe })} disabled={imageBusy || recipeBusy} className="flex-1 h-10 rounded-[8px] bg-[hsl(var(--primary))] text-white text-sm disabled:opacity-50">Save</button>
        </div>
        <style>{`.input{width:100%;height:40px;border-radius:8px;border:1px solid hsl(var(--border));padding:0 12px;font-size:14px;background:transparent;color:hsl(var(--foreground));outline:none}.input:focus{border-color:hsl(var(--primary))}.category-select{background:#2F241F}.category-select option{background:#2F241F;color:#fff}`}</style>
      </div>
    </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div><label className="text-[13px] text-[hsl(var(--muted-foreground))]">{label}</label><div className="mt-1">{children}</div></div>;
}
