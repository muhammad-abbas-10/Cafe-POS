const settingsRepository = require("../repositories/settings.repository");
const ApiError = require("../utils/ApiError");

async function getAllSettings() {
  return settingsRepository.findAll();
}

async function getSettingByKey(key) {
  const setting = await settingsRepository.findByKey(key);
  if (!setting) {
    throw new ApiError(404, "Setting not found");
  }
  return setting;
}

async function setSetting(key, value) {
  if (!key || !key.trim()) {
    throw new ApiError(400, "Setting key is required");
  }
  if (value === undefined || value === null) {
    throw new ApiError(400, "Setting value is required");
  }

  return settingsRepository.upsert(key.trim(), String(value));
}

async function deleteSetting(key) {
  await getSettingByKey(key); // throws 404 if it doesn't exist
  return settingsRepository.remove(key);
}

module.exports = { getAllSettings, getSettingByKey, setSetting, deleteSetting };