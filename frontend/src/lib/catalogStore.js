import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/apiClient";
import imgEspresso from "@/assets/espreso.jpg";
import imgCappuccino from "@/assets/cappuccino.jpg";
import imgColdBrew from "@/assets/Cold brew.jpg";
import imgOrangeJuice from "@/assets/Orange juice.jpg";
import imgGreenJuice from "@/assets/Green juice.jpg";
import imgMatcha from "@/assets/Matcha latte.jpg";
import imgChocolate from "@/assets/Hot chocolate.jpg";
import imgCroissant from "@/assets/Butter croissant.jpg";
import imgRice from "@/assets/Rice bowl.jpg";
import imgFriedRice from "@/assets/Egg fried rice.jpg";
import imgCheesecake from "@/assets/Cheesecake.jpg";
import imgBrownie from "@/assets/Fudge brownie.jpg";
import imgTiramisu from "@/assets/Tiramisu.jpg";

const FALLBACK_IMAGE_BY_NAME = new Map(
  [["espresso", imgEspresso], ["cappuccino", imgCappuccino], ["cold brew", imgColdBrew], ["orange juice", imgOrangeJuice], ["green juice", imgGreenJuice], ["matcha latte", imgMatcha], ["hot chocolate", imgChocolate], ["butter croissant", imgCroissant], ["rice bowl", imgRice], ["egg fried rice", imgFriedRice], ["cheesecake", imgCheesecake], ["fudge brownie", imgBrownie], ["tiramisu", imgTiramisu]]
);

function fallbackImageFor(name) {
  return FALLBACK_IMAGE_BY_NAME.get(name?.trim().toLowerCase()) ?? null;
}

function toFrontendCategory(row) {
  return {
    id: row.id,
    name: row.name,
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
    // Existing database rows may predate image uploads. Keep their stored URL
    // when present, otherwise use the matching packaged menu image.
    image: row.image_url || fallbackImageFor(row.name),
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

export async function fetchItemIngredients(id) {
  return apiGet(`/menu-items/${id}/ingredients`);
}

export async function updateItemIngredients(id, recipe) {
  return apiPut(`/menu-items/${id}/ingredients`, { recipe });
}

// --- Ingredients ---

export async function fetchIngredients() {
  return apiGet("/ingredients");
}

// --- Addons ---

export async function fetchAddons() {
  const rows = await apiGet("/addons");
  return rows.map((addon) => ({ ...addon, price: Number(addon.price) }));
}

export async function createIngredient({ name, unit, stock_qty, threshold }) {
  return apiPost("/ingredients", { name, unit, stock_qty, threshold });
}

export async function updateIngredient(id, { name, unit, stock_qty, threshold }) {
  return apiPut(`/ingredients/${id}`, { name, unit, stock_qty, threshold });
}

export async function deleteIngredient(id) {
  await apiDelete(`/ingredients/${id}`);
}

// --- Inventory adjustments ---

export async function fetchAdjustments() {
  return apiGet("/inventory-adjustments");
}

export async function createAdjustment({ ingredient_id, delta, reason }) {
  return apiPost("/inventory-adjustments", { ingredient_id, delta, reason });
}

// --- Staff ---
export async function fetchStaff() { return apiGet("/staff"); }
export async function createStaffMember({ name, role, active }) { return apiPost("/staff", { name, role, active }); }
export async function updateStaffMember(id, { name, role, active }) { return apiPut(`/staff/${id}`, { name, role, active }); }
export async function deleteStaffMember(id) { return apiDelete(`/staff/${id}`); }

// --- Shifts ---
export async function fetchShifts() { return apiGet("/shifts"); }
export async function clockIn({ staff_id, till_start }) { return apiPost("/shifts", { staff_id, till_start }); }
export async function clockOutShift(id, till_end) { return apiPatch(`/shifts/${id}/clock-out`, { till_end }); }

// --- Settings ---
export async function fetchSettings() { return apiGet("/settings"); }
export async function setSetting(key, value) { return apiPut(`/settings/${key}`, { value }); }

// --- Orders ---
export async function fetchOrders() { return apiGet("/orders"); }
export async function fetchReportSummary() { return apiGet("/orders/reports/summary"); }
export async function fetchOrderById(id) { return apiGet(`/orders/${id}`); }
export async function updateOrderStatus(id, status) { return apiPatch(`/orders/${id}/status`, { status }); }
