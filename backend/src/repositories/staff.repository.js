const pool = require("../config/db");

async function findAll() {
  const result = await pool.query(
    "SELECT * FROM staff ORDER BY name ASC"
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM staff WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function create({ name, role, active }) {
  const result = await pool.query(
    `INSERT INTO staff (name, role, active)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, role, active]
  );
  return result.rows[0];
}

async function update(id, { name, role, active }) {
  const result = await pool.query(
    `UPDATE staff
     SET name = $1, role = $2, active = $3, updated_at = now()
     WHERE id = $4
     RETURNING *`,
    [name, role, active, id]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query(
    "DELETE FROM staff WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

module.exports = { findAll, findById, create, update, remove };