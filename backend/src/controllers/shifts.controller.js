const shiftsService = require("../services/shifts.service");

async function getAll(req, res) {
  const shifts = await shiftsService.getAllShifts();
  res.json(shifts);
}

async function getById(req, res) {
  const shift = await shiftsService.getShiftById(req.params.id);
  res.json(shift);
}

async function clockIn(req, res) {
  const shift = await shiftsService.clockIn(req.body);
  res.status(201).json(shift);
}

async function clockOut(req, res) {
  const shift = await shiftsService.clockOut(req.params.id, req.body);
  res.json(shift);
}

async function remove(req, res) {
  await shiftsService.deleteShift(req.params.id);
  res.status(204).send();
}

module.exports = { getAll, getById, clockIn, clockOut, remove };