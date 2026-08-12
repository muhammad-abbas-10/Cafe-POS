const inventoryAdjustmentsService = require("../services/inventoryAdjustments.service");

async function getAll(req, res) {
  const adjustments = await inventoryAdjustmentsService.getAllAdjustments();
  res.json(adjustments);
}

async function getById(req, res) {
  const adjustment = await inventoryAdjustmentsService.getAdjustmentById(req.params.id);
  res.json(adjustment);
}

async function getForIngredient(req, res) {
  const adjustments = await inventoryAdjustmentsService.getAdjustmentsForIngredient(req.params.ingredientId);
  res.json(adjustments);
}

async function create(req, res) {
  const adjustment = await inventoryAdjustmentsService.createAdjustment(req.body);
  res.status(201).json(adjustment);
}

module.exports = { getAll, getById, getForIngredient, create };
