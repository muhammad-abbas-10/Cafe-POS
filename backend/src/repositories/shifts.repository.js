const pool = require("../config/db");

async function findAll() {
  const result = await pool.query(
    "SELECT * FROM shifts ORDER BY clock_in DESC"
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM shifts WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function findOpenShiftByStaffId(staff_id) {
  const result = await pool.query(
    "SELECT * FROM shifts WHERE staff_id = $1 AND clock_out IS NULL",
    [staff_id]
  );
  return result.rows[0];
}

async function create({ staff_id, till_start }) {
  const result = await pool.query(
    `INSERT INTO shifts (staff_id, till_start)
     VALUES ($1, $2)
     RETURNING *`,
    [staff_id, till_start]
  );
  return result.rows[0];
}

async function clockOut(id, { clock_out, till_end }) {
  const result = await pool.query(
    `UPDATE shifts
     SET clock_out = $1, till_end = $2
     WHERE id = $3
     RETURNING *`,
    [clock_out, till_end, id]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query(
    "DELETE FROM shifts WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

module.exports = {
  findAll,
  findById,
  findOpenShiftByStaffId,
  create,
  clockOut,
  remove,
};