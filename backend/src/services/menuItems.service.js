const menuItemsRepository = require("../repositories/menuItems.repository");
const categoriesRepository = require("../repositories/categories.repository");
const ApiError = require("../utils/ApiError");

async function getAllMenuItems() {
  return menuItemsRepository.findAll();
}

async function getMenuItemById(id) {
  const item = await menuItemsRepository.findById(id);
  if (!item) {
    throw new ApiError(404, "Menu item not found");
  }
  return item;
}

async function validateMenuItemInput({ category_id, name, price }) {
  if (!name || !name.trim()) {
    throw new ApiError(400, "Item name is required");
  }
  if (price === undefined || price === null || isNaN(price) || price < 0) {
    throw new ApiError(400, "Price must be a valid non-negative number");
  }
  if (!category_id) {
    throw new ApiError(400, "category_id is required");
  }

  const category = await categoriesRepository.findById(category_id);
  if (!category) {
    throw new ApiError(400, "category_id does not match an existing category");
  }
}

async function createMenuItem(data) {
  await validateMenuItemInput(data);

  return menuItemsRepository.create({
    category_id: data.category_id,
    name: data.name.trim(),
    description: data.description ?? "",
    price: data.price,
    image_url: data.image_url ?? null,
    is_drink: data.is_drink ?? true,
    is_available: data.is_available ?? true,
  });
}

async function updateMenuItem(id, data) {
  await getMenuItemById(id); // throws 404 if it doesn't exist
  await validateMenuItemInput(data);

  return menuItemsRepository.update(id, {
    category_id: data.category_id,
    name: data.name.trim(),
    description: data.description ?? "",
    price: data.price,
    image_url: data.image_url ?? null,
    is_drink: data.is_drink ?? true,
    is_available: data.is_available ?? true,
  });
}

async function deleteMenuItem(id) {
  await getMenuItemById(id); // throws 404 if it doesn't exist
  return menuItemsRepository.remove(id);
}

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};