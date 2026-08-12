const ingredientsRepository = require("../repositories/ingredients.repository");
const ApiError = require("../utils/ApiError");

async function getAllIngredients() {
  return ingredientsRepository.findAll();
}

async function getIngredientById(id) {
  const ingredient = await ingredientsRepository.findById(id);
  if (!ingredient) {
    throw new ApiError(404, "Ingredient not found");
  }
  return ingredient;
}

function validateIngredientInput({ name, unit, stock_qty, threshold }) {
  if (!name || !name.trim()) {
    throw new ApiError(400, "Ingredient name is required");
  }
  if (!unit || !unit.trim()) {
    throw new ApiError(400, "Unit is required (e.g. g, ml, pcs)");
  }
  if (stock_qty !== undefined && (isNaN(stock_qty) || stock_qty < 0)) {
    throw new ApiError(400, "stock_qty must be a non-negative number");
  }
  if (threshold !== undefined && (isNaN(threshold) || threshold < 0)) {
    throw new ApiError(400, "threshold must be a non-negative number");
  }
}

async function createIngredient(data) {
  validateIngredientInput(data);

  const existing = await ingredientsRepository.findByName(data.name.trim());
  if (existing) {
    throw new ApiError(409, "An ingredient with this name already exists");
  }

  return ingredientsRepository.create({
    name: data.name.trim(),
    unit: data.unit.trim(),
    stock_qty: data.stock_qty ?? 0,
    threshold: data.threshold ?? 0,
  });
}

async function updateIngredient(id, data) {
  await getIngredientById(id); // throws 404 if it doesn't exist
  validateIngredientInput(data);

  const existing = await ingredientsRepository.findByName(data.name.trim());
  if (existing && existing.id !== id) {
    throw new ApiError(409, "An ingredient with this name already exists");
  }

  return ingredientsRepository.update(id, {
    name: data.name.trim(),
    unit: data.unit.trim(),
    stock_qty: data.stock_qty ?? 0,
    threshold: data.threshold ?? 0,
  });
}

async function deleteIngredient(id) {
  await getIngredientById(id); // throws 404 if it doesn't exist
  try {
    return await ingredientsRepository.remove(id);
  } catch (err) {
    if (err.code === "23503") {
      throw new ApiError(409, "This ingredient has stock history and cannot be removed");
    }
    throw err;
  }
}

module.exports = {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};
