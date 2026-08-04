const categoriesService = require("../services/categories.service");

async function getAll(req, res) {
  const categories = await categoriesService.getAllCategories();
  res.json(categories);
}

async function getById(req, res) {
  const category = await categoriesService.getCategoryById(req.params.id);
  res.json(category);
}

async function create(req, res) {
  const category = await categoriesService.createCategory(req.body);
  res.status(201).json(category);
}

async function update(req, res) {
  const category = await categoriesService.updateCategory(
    req.params.id,
    req.body
  );
  res.json(category);
}

async function remove(req, res) {
  await categoriesService.deleteCategory(req.params.id);
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };