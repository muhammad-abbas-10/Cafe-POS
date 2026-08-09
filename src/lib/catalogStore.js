import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient";

const ICON_BY_NAME = [
  { match: "coffee", icon: "☕" },
  { match: "juice", icon: "🧃" },
  { match: "milk", icon: "🥛" },
  { match: "rice", icon: "🍚" },
  { match: "snack", icon: "🍪" },
  { match: "dessert", icon: "🍰" },
];
const DEFAULT_ICON = "🍽️";

function iconForCategoryName(name) {
  const lower = name.toLowerCase();
  const found = ICON_BY_NAME.find((entry) => lower.includes(entry.match));
  return found ? found.icon : DEFAULT_ICON;
}

function toFrontendCategory(row) {
  return {
    id: row.id,
    name: row.name,
    icon: iconForCategoryName(row.name),
    sort_order: row.sort_order,
  };
}

function toFrontendItem(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category_id,
    image: row.image_url,
    available: row.is_available,
    drink: row.is_drink,
  };
}

function toBackendItemPayload(item) {
  return {
    category_id: item.category,
    name: item.name,
    description: item.description ?? "",
    price: item.price,
    image_url: item.image ?? null,
    is_drink: item.drink,
    is_available: item.available,
  };
}

// --- Categories ---

export async function fetchCategories() {
  const rows = await apiGet("/categories");
  return rows.map(toFrontendCategory);
}

export async function createCategory({ name, sort_order }) {
  const row = await apiPost("/categories", { name, sort_order });
  return toFrontendCategory(row);
}

export async function updateCategory(id, { name, sort_order }) {
  const row = await apiPut(`/categories/${id}`, { name, sort_order });
  return toFrontendCategory(row);
}

export async function deleteCategory(id) {
  await apiDelete(`/categories/${id}`);
}

// --- Menu items ---

export async function fetchItems() {
  const rows = await apiGet("/menu-items");
  return rows.map(toFrontendItem);
}

export async function createItem(item) {
  const row = await apiPost("/menu-items", toBackendItemPayload(item));
  return toFrontendItem(row);
}

export async function updateItem(id, item) {
  const row = await apiPut(`/menu-items/${id}`, toBackendItemPayload(item));
  return toFrontendItem(row);
}

export async function deleteItem(id) {
  await apiDelete(`/menu-items/${id}`);
}