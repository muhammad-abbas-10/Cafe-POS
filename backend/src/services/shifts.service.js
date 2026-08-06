const shiftsRepository = require("../repositories/shifts.repository");
const staffRepository = require("../repositories/staff.repository");
const ApiError = require("../utils/ApiError");

async function getAllShifts() {
  return shiftsRepository.findAll();
}

async function getShiftById(id) {
  const shift = await shiftsRepository.findById(id);
  if (!shift) {
    throw new ApiError(404, "Shift not found");
  }
  return shift;
}

async function clockIn({ staff_id, till_start }) {
  if (!staff_id) {
    throw new ApiError(400, "staff_id is required");
  }

  const staff = await staffRepository.findById(staff_id);
  if (!staff) {
    throw new ApiError(400, "staff_id does not match an existing staff member");
  }

  const openShift = await shiftsRepository.findOpenShiftByStaffId(staff_id);
  if (openShift) {
    throw new ApiError(409, "This staff member already has an open shift");
  }

  return shiftsRepository.create({
    staff_id,
    till_start: till_start ?? null,
  });
}

async function clockOut(id, { till_end }) {
  const shift = await getShiftById(id); // throws 404 if it doesn't exist

  if (shift.clock_out !== null) {
    throw new ApiError(409, "This shift has already been clocked out");
  }

  return shiftsRepository.clockOut(id, {
    clock_out: new Date(),
    till_end: till_end ?? null,
  });
}

async function deleteShift(id) {
  await getShiftById(id); // throws 404 if it doesn't exist
  return shiftsRepository.remove(id);
}

module.exports = {
  getAllShifts,
  getShiftById,
  clockIn,
  clockOut,
  deleteShift,
};