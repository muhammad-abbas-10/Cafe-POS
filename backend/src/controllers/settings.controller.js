const settingsService = require("../services/settings.service");

async function getAll(req, res) {
  const settings = await settingsService.getAllSettings();
  res.json(settings);
}

async function getByKey(req, res) {
  const setting = await settingsService.getSettingByKey(req.params.key);
  res.json(setting);
}

async function set(req, res) {
  const setting = await settingsService.setSetting(req.params.key, req.body.value);
  res.json(setting);
}

async function remove(req, res) {
  await settingsService.deleteSetting(req.params.key);
  res.status(204).send();
}

module.exports = { getAll, getByKey, set, remove };