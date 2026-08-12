export const formatPrice = (value) => `Rs ${(Number(value) || 0).toFixed(2)}`;

const DRINK_SIZES = [{ id: "S", name: "Small", delta: 0 }, { id: "M", name: "Medium", delta: 0.5 }, { id: "L", name: "Large", delta: 1 }];
const FOOD_SIZE = [{ id: "REG", name: "Regular", delta: 0 }];
export const sizesFor = (item) => (item.drink ? DRINK_SIZES : FOOD_SIZE);
export const SUGAR_OPTIONS = ["0%", "25%", "50%", "75%", "100%"];
export const ICE_OPTIONS = ["No ice", "Less", "Regular", "Extra"];
