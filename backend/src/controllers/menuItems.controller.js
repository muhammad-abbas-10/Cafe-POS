const menuItemsService = require("../services/menuItems.service");

async function getAll(req, res) {
  const items = await menuItemsService.getAllMenuItems();
  res.json(items);
}

async function getById(req, res) {
  const item = await menuItemsService.getMenuItemById(req.params.id);
  res.json(item);
}

async function create(req, res) {
  const item = await menuItemsService.createMenuItem(req.body);
  res.status(201).json(item);
}

async function update(req, res) {
  const item = await menuItemsService.updateMenuItem(req.params.id, req.body);
  res.json(item);
}

async function remove(req, res) {
  await menuItemsService.deleteMenuItem(req.params.id);
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };