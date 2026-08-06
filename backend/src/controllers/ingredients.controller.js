const ingredientsService = require("../services/ingredients.service");

async function getAll(req, res) {
  const ingredients = await ingredientsService.getAllIngredients();
  res.json(ingredients);
}

async function getById(req, res) {
  const ingredient = await ingredientsService.getIngredientById(req.params.id);
  res.json(ingredient);
}

async function create(req, res) {
  const ingredient = await ingredientsService.createIngredient(req.body);
  res.status(201).json(ingredient);
}

async function update(req, res) {
  const ingredient = await ingredientsService.updateIngredient(
    req.params.id,
    req.body
  );
  res.json(ingredient);
}

async function remove(req, res) {
  await ingredientsService.deleteIngredient(req.params.id);
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };