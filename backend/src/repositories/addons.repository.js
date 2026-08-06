const pool = require("../config/db");

async function findAll() {
  const result = await pool.query(
    "SELECT * FROM addons ORDER BY name ASC"
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM addons WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function findByName(name) {
  const result = await pool.query(
    "SELECT * FROM addons WHERE name = $1",
    [name]
  );
  return result.rows[0];
}

async function create({ name, price, active }) {
  const result = await pool.query(
    `INSERT INTO addons (name, price, active)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, price, active]
  );
  return result.rows[0];
}

async function update(id, { name, price, active }) {
  const result = await pool.query(
    `UPDATE addons
     SET name = $1, price = $2, active = $3
     WHERE id = $4
     RETURNING *`,
    [name, price, active, id]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query(
    "DELETE FROM addons WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

module.exports = { findAll, findById, findByName, create, update, remove };