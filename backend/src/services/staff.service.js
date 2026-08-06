const staffRepository = require("../repositories/staff.repository");
const ApiError = require("../utils/ApiError");

const VALID_ROLES = ["admin", "manager", "cashier"];

async function getAllStaff() {
  return staffRepository.findAll();
}

async function getStaffById(id) {
  const staff = await staffRepository.findById(id);
  if (!staff) {
    throw new ApiError(404, "Staff member not found");
  }
  return staff;
}

function validateStaffInput({ name, role }) {
  if (!name || !name.trim()) {
    throw new ApiError(400, "Staff name is required");
  }
  if (!role || !VALID_ROLES.includes(role)) {
    throw new ApiError(
      400,
      `Role must be one of: ${VALID_ROLES.join(", ")}`
    );
  }
}

async function createStaff(data) {
  validateStaffInput(data);

  return staffRepository.create({
    name: data.name.trim(),
    role: data.role,
    active: data.active ?? true,
  });
}

async function updateStaff(id, data) {
  await getStaffById(id); // throws 404 if it doesn't exist
  validateStaffInput(data);

  return staffRepository.update(id, {
    name: data.name.trim(),
    role: data.role,
    active: data.active ?? true,
  });
}

async function deleteStaff(id) {
  await getStaffById(id); // throws 404 if it doesn't exist
  return staffRepository.remove(id);
}

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};