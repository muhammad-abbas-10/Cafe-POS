export const TAX_RATE = 0.08;

export const formatPrice = (n) => `Rs ${(Number(n) || 0).toFixed(2)}`;

export const CATEGORIES = [
  { id: "coffee", name: "Coffee", icon: "☕" },
  { id: "juice", name: "Juice", icon: "🧃" },
  { id: "milk", name: "Milk-based", icon: "🥛" },
  { id: "rice", name: "Rice", icon: "🍚" },
  { id: "snack", name: "Snack", icon: "🍪" },
  { id: "dessert", name: "Dessert", icon: "🍰" },
];

const SIZES_DRINK = [
  { id: "S", name: "Small", delta: 0 },
  { id: "M", name: "Medium", delta: 0.5 },
  { id: "L", name: "Large", delta: 1.0 },
];
const SIZES_NONE = [{ id: "REG", name: "Regular", delta: 0 }];

export const ADDONS = [
  { id: "espresso-shot", name: "Extra espresso shot", price: 0.8 },
  { id: "whipped-cream", name: "Whipped cream", price: 0.5 },
  { id: "oat-milk", name: "Oat milk swap", price: 0.6 },
  { id: "caramel-syrup", name: "Caramel syrup", price: 0.5 },
  { id: "vanilla-syrup", name: "Vanilla syrup", price: 0.5 },
  { id: "extra-shot-decaf", name: "Decaf shot", price: 0.8 },
];

export const MENU_ITEMS = [
  { id: "mi-1", name: "Espresso", description: "Rich single-origin double shot", price: 3.0, category: "coffee", image: imgEspresso, available: true, drink: true },
  { id: "mi-2", name: "Cappuccino", description: "Espresso, steamed milk, foam", price: 4.5, category: "coffee", image: imgCappuccino, available: true, drink: true },
  { id: "mi-3", name: "Café latte", description: "Smooth espresso with silky milk", price: 4.75, category: "coffee", image: imgCafeLatte, available: true, drink: true },
  { id: "mi-4", name: "Americano", description: "Espresso lengthened with hot water", price: 3.5, category: "coffee", image: imgAmericano, available: true, drink: true },
  { id: "mi-5", name: "Mocha", description: "Espresso, chocolate, steamed milk", price: 5.0, category: "coffee", image: imgMocha, available: true, drink: true },
  { id: "mi-6", name: "Cold brew", description: "18-hour steeped, smooth and bold", price: 4.5, category: "coffee", image: imgColdBrew, available: true, drink: true },
  { id: "mi-7", name: "Orange juice", description: "Freshly squeezed, no added sugar", price: 4.0, category: "juice", image: imgOrangeJuice, available: true, drink: true },
  { id: "mi-8", name: "Green juice", description: "Kale, apple, cucumber, ginger", price: 5.0, category: "juice", image: imgGreenJuice, available: true, drink: true },
  { id: "mi-9", name: "Berry smoothie", description: "Mixed berries, banana, yogurt", price: 5.5, category: "juice", image: imgBerrySmoothie, available: true, drink: true },
  { id: "mi-10", name: "Matcha latte", description: "Ceremonial matcha, steamed milk", price: 5.25, category: "milk", image: imgMatchaLatte, available: true, drink: true },
  { id: "mi-11", name: "Hot chocolate", description: "Dark chocolate, steamed milk", price: 4.5, category: "milk", image: imgHotChocolate, available: true, drink: true },
  { id: "mi-12", name: "Chai latte", description: "Spiced chai, steamed milk", price: 4.75, category: "milk", image: imgChaiLatte, available: true, drink: true },
  { id: "mi-13", name: "Rice bowl", description: "Rice, teriyaki chicken, greens", price: 7.5, category: "rice", image: imgRiceBowl, available: true, drink: false },
  { id: "mi-14", name: "Egg fried rice", description: "Wok-tossed with scallion", price: 6.5, category: "rice", image: imgEggFriedRice, available: true, drink: false },
  { id: "mi-15", name: "Butter croissant", description: "Flaky, all-butter, baked daily", price: 3.5, category: "snack", image: imgCroissant, available: true, drink: false },
  { id: "mi-16", name: "Blueberry muffin", description: "Soft crumb, fresh blueberries", price: 3.0, category: "snack", image: imgBlueberryMuffin, available: true, drink: false },
  { id: "mi-17", name: "Choc chip cookies", price: 2.5, description: "Two soft-baked cookies", category: "snack", image: imgCookies, available: true, drink: false },
  { id: "mi-18", name: "Cheesecake", description: "New York baked, berry coulis", price: 5.5, category: "dessert", image: imgCheesecake, available: true, drink: false },
  { id: "mi-19", name: "Fudge brownie", description: "Dense, gooey, walnut", price: 4.0, category: "dessert", image: imgBrownie, available: true, drink: false },
  { id: "mi-20", name: "Tiramisu", description: "Coffee-soaked, mascarpone", price: 5.75, category: "dessert", image: imgTiramisu, available: true, drink: false },
];

export const sizesFor = (item) => (item.drink ? SIZES_DRINK : SIZES_NONE);

export const SUGAR_OPTIONS = ["0%", "25%", "50%", "75%", "100%"];
export const ICE_OPTIONS = ["No ice", "Less", "Regular", "Extra"];

export const INGREDIENTS = [
  { id: "ing-1", name: "Whole milk", stock: 14.2, unit: "L", threshold: 5, linked: ["mi-2", "mi-3", "mi-5", "mi-11", "mi-12"] },
  { id: "ing-2", name: "Oat milk", stock: 3.1, unit: "L", threshold: 4, linked: ["mi-10"] },
  { id: "ing-3", name: "Espresso beans", stock: 6.8, unit: "kg", threshold: 2, linked: ["mi-1", "mi-2", "mi-3", "mi-4", "mi-5", "mi-6"] },
  { id: "ing-4", name: "Caramel syrup", stock: 1.2, unit: "L", threshold: 1, linked: ["mi-5"] },
  { id: "ing-5", name: "Vanilla syrup", stock: 0.8, unit: "L", threshold: 1, linked: [] },
  { id: "ing-6", name: "12oz cups", stock: 240, unit: "pcs", threshold: 100, linked: [] },
  { id: "ing-7", name: "16oz cups", stock: 86, unit: "pcs", threshold: 100, linked: [] },
  { id: "ing-8", name: "Matcha powder", stock: 0.9, unit: "kg", threshold: 0.5, linked: ["mi-10"] },
  { id: "ing-9", name: "Dark chocolate", stock: 4.4, unit: "kg", threshold: 1, linked: ["mi-11"] },
  { id: "ing-10", name: "Rice (cooked)", stock: 9.0, unit: "kg", threshold: 3, linked: ["mi-13", "mi-14"] },
];

export const PROMOTIONS = [
  { id: "pr-1", code: "MORNING10", description: "10% off before 11am", type: "percent", value: 10, active: true, start: "2026-07-01", end: "2026-12-31" },
  { id: "pr-2", code: "COMBO5", description: "Rs 5 off orders over Rs 30", type: "fixed", value: 5, active: true, start: "2026-07-15", end: "2026-08-15" },
  { id: "pr-3", code: "SUMMER", description: "15% off all cold drinks", type: "percent", value: 15, active: false, start: "2026-06-01", end: "2026-08-31" },
];

export const STAFF = [
  { id: "st-1", name: "Aria Patel", role: "Manager", shift: "Open 7:00 – 15:00", clockedIn: true, ordersHandled: 0 },
  { id: "st-2", name: "Leo Marsh", role: "Cashier", shift: "Mid 11:00 – 19:00", clockedIn: true, ordersHandled: 42 },
  { id: "st-3", name: "Nina Costa", role: "Cashier", shift: "Open 7:00 – 15:00", clockedIn: true, ordersHandled: 38 },
  { id: "st-4", name: "Sam Okafor", role: "Kitchen", shift: "Close 15:00 – 23:00", clockedIn: false, ordersHandled: 0 },
  { id: "st-5", name: "Mira Diaz", role: "Kitchen", shift: "Mid 11:00 – 19:00", clockedIn: true, ordersHandled: 0 },
];

export const HOURLY_SALES = [
  { hour: "7a", sales: 184 }, { hour: "8a", sales: 312 }, { hour: "9a", sales: 268 },
  { hour: "10a", sales: 196 }, { hour: "11a", sales: 240 }, { hour: "12p", sales: 410 },
  { hour: "1p", sales: 388 }, { hour: "2p", sales: 222 }, { hour: "3p", sales: 168 },
  { hour: "4p", sales: 142 }, { hour: "5p", sales: 210 }, { hour: "6p", sales: 264 },
];

export const TOP_ITEMS = [
  { name: "Café latte", qty: 64, revenue: 304.0 },
  { name: "Cappuccino", qty: 51, revenue: 229.5 },
  { name: "Butter croissant", qty: 47, revenue: 164.5 },
  { name: "Cold brew", qty: 39, revenue: 175.5 },
  { name: "Matcha latte", qty: 28, revenue: 147.0 },
];

export const SLOW_ITEMS = [
  { name: "Egg fried rice", qty: 4, revenue: 26.0 },
  { name: "Green juice", qty: 6, revenue: 30.0 },
  { name: "Chai latte", qty: 9, revenue: 42.75 },
];
import imgEspresso from "@/assets/espreso.jpg";
import imgCappuccino from "@/assets/cappuccino.jpg";
import imgCafeLatte from "@/assets/Café latte.jpg";
import imgAmericano from "@/assets/Americano.jpg";
import imgMocha from "@/assets/Mocha.jpg";
import imgColdBrew from "@/assets/Cold brew.jpg";
import imgOrangeJuice from "@/assets/Orange juice.jpg";
import imgGreenJuice from "@/assets/Green juice.jpg";
import imgBerrySmoothie from "@/assets/Berry smoothie.jpg";
import imgMatchaLatte from "@/assets/Matcha latte.jpg";
import imgHotChocolate from "@/assets/Hot chocolate.jpg";
import imgChaiLatte from "@/assets/Chai latte.jpg";
import imgRiceBowl from "@/assets/Rice bowl.jpg";
import imgEggFriedRice from "@/assets/Egg fried rice.jpg";
import imgCroissant from "@/assets/Butter croissant.jpg";
import imgBlueberryMuffin from "@/assets/Blueberry muffin.jpg";
import imgCookies from "@/assets/Choc chip cookies.jpg";
import imgCheesecake from "@/assets/Cheesecake.jpg";
import imgBrownie from "@/assets/Fudge brownie.jpg";
import imgTiramisu from "@/assets/Tiramisu.jpg";
