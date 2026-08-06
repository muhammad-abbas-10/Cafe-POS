const addonsRepository = require("../repositories/addons.repository");
const ApiError = require("../utils/ApiError");

async function getAllAddons() {
  return addonsRepository.findAll();
}

async function getAddonById(id) {
  const addon = await addonsRepository.findById(id);
  if (!addon) {
    throw new ApiError(404, "Addon not found");
  }
  return addon;
}

function validateAddonInput({ name, price }) {
  if (!name || !name.trim()) {
    throw new ApiError(400, "Addon name is required");
  }
  if (price === undefined || price === null || isNaN(price) || price < 0) {
    throw new ApiError(400, "Price must be a valid non-negative number");
  }
}

async function createAddon(data) {
  validateAddonInput(data);

  const existing = await addonsRepository.findByName(data.name.trim());
  if (existing) {
    throw new ApiError(409, "An addon with this name already exists");
  }

  return addonsRepository.create({
    name: data.name.trim(),
    price: data.price,
    active: data.active ?? true,
  });
}

async function updateAddon(id, data) {
  await getAddonById(id); // throws 404 if it doesn't exist
  validateAddonInput(data);

  const existing = await addonsRepository.findByName(data.name.trim());
  if (existing && existing.id !== id) {
    throw new ApiError(409, "An addon with this name already exists");
  }

  return addonsRepository.update(id, {
    name: data.name.trim(),
    price: data.price,
    active: data.active ?? true,
  });
}

async function deleteAddon(id) {
  await getAddonById(id); // throws 404 if it doesn't exist
  return addonsRepository.remove(id);
}

module.exports = {
  getAllAddons,
  getAddonById,
  createAddon,
  updateAddon,
  deleteAddon,
};