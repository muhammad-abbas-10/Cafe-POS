import { CATEGORIES as DEFAULT_CATEGORIES, MENU_ITEMS as DEFAULT_ITEMS } from "@/lib/cafeData";

const CAT_KEY = "pos_categories";
const ITEM_KEY = "pos_menu";

export function loadCategories() {
  const saved = localStorage.getItem(CAT_KEY);
  return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
}

export function saveCategories(list) {
  localStorage.setItem(CAT_KEY, JSON.stringify(list));
}

export function loadItems() {
  const saved = localStorage.getItem(ITEM_KEY);
  return saved ? JSON.parse(saved) : DEFAULT_ITEMS;
}

export function saveItems(list) {
  localStorage.setItem(ITEM_KEY, JSON.stringify(list));
}
