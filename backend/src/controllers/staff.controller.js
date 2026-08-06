const staffService = require("../services/staff.service");

async function getAll(req, res) {
  const staff = await staffService.getAllStaff();
  res.json(staff);
}

async function getById(req, res) {
  const staff = await staffService.getStaffById(req.params.id);
  res.json(staff);
}

async function create(req, res) {
  const staff = await staffService.createStaff(req.body);
  res.status(201).json(staff);
}

async function update(req, res) {
  const staff = await staffService.updateStaff(req.params.id, req.body);
  res.json(staff);
}

async function remove(req, res) {
  await staffService.deleteStaff(req.params.id);
  res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };