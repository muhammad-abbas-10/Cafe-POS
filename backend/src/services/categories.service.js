const categoriesRepository = require("../repositories/categories.repository");
const ApiError = require("../utils/ApiError");

async function getAllCategories() {
  return categoriesRepository.findAll();
}

async function getCategoryById(id) {
  const category = await categoriesRepository.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return category;
}

async function createCategory({ name, sort_order }) {
  if (!name || !name.trim()) {
    throw new ApiError(400, "Category name is required");
  }
  return categoriesRepository.create({
    name: name.trim(),
    sort_order: sort_order ?? 0,
  });
}

async function updateCategory(id, { name, sort_order }) {
  await getCategoryById(id); // throws 404 if it doesn't exist

  if (!name || !name.trim()) {
    throw new ApiError(400, "Category name is required");
  }

  return categoriesRepository.update(id, {
    name: name.trim(),
    sort_order: sort_order ?? 0,
  });
}

async function deleteCategory(id) {
  await getCategoryById(id); // throws 404 if it doesn't exist
  return categoriesRepository.remove(id);
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
