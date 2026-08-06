const pool = require("../config/db");
const inventoryAdjustmentsRepository = require("../repositories/inventoryAdjustments.repository");
const ingredientsRepository = require("../repositories/ingredients.repository");
const ApiError = require("../utils/ApiError");

async function getAllAdjustments() {
  return inventoryAdjustmentsRepository.findAll();
}

async function getAdjustmentById(id) {
  const adjustment = await inventoryAdjustmentsRepository.findById(id);
  if (!adjustment) {
    throw new ApiError(404, "Inventory adjustment not found");
  }
  return adjustment;
}

async function getAdjustmentsForIngredient(ingredient_id) {
  const ingredient = await ingredientsRepository.findById(ingredient_id);
  if (!ingredient) {
    throw new ApiError(404, "Ingredient not found");
  }
  return inventoryAdjustmentsRepository.findByIngredientId(ingredient_id);
}

async function createAdjustment({ ingredient_id, delta, reason, staff_id }) {
  if (!ingredient_id) {
    throw new ApiError(400, "ingredient_id is required");
  }
  if (delta === undefined || delta === null || isNaN(delta) || Number(delta) === 0) {
    throw new ApiError(400, "delta must be a non-zero number");
  }
  if (!reason || !reason.trim()) {
    throw new ApiError(400, "reason is required");
  }

  const ingredient = await ingredientsRepository.findById(ingredient_id);
  if (!ingredient) {
    throw new ApiError(400, "ingredient_id does not match an existing ingredient");
  }

  const newStock = Number(ingredient.stock_qty) + Number(delta);
  if (newStock < 0) {
    throw new ApiError(400, "This adjustment would make stock negative");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const adjustment = await inventoryAdjustmentsRepository.create(
      { ingredient_id, delta, reason: reason.trim(), staff_id: staff_id ?? null },
      client
    );

    await ingredientsRepository.adjustStock(ingredient_id, delta, client);

    await client.query("COMMIT");
    return adjustment;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  getAllAdjustments,
  getAdjustmentById,
  getAdjustmentsForIngredient,
  createAdjustment,
};