const addonsService = require("../services/addons.service");

async function getAll(req, res) {
  const addons = await addonsService.getAllAddons();
  res.json(addons);
}

async function getById(req, res) {
  const addon = await addonsService.getAddonById(req.params.id);
  res.json(addon);
}

async function create(req, res) {
  const addon = await addonsService.createAddon(req.body);
  res.status(201).json(addon);
}

async function update(req, res) {
  const addon = await addonsService.updateAddon(req.params.id, req.body);
  res.json(addon);
}

async function remove(req, res) {
  await addonsService.deleteAddon(req.params.id);
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };