const pool = require("../config/db");

async function findAll() {
  const result = await pool.query(
    "SELECT * FROM ingredients ORDER BY name ASC"
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM ingredients WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function create({ name, unit, stock_qty, threshold }) {
  const result = await pool.query(
    `INSERT INTO ingredients (name, unit, stock_qty, threshold)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, unit, stock_qty, threshold]
  );
  return result.rows[0];
}

async function update(id, { name, unit, stock_qty, threshold }) {
  const result = await pool.query(
    `UPDATE ingredients
     SET name = $1, unit = $2, stock_qty = $3, threshold = $4, updated_at = now()
     WHERE id = $5
     RETURNING *`,
    [name, unit, stock_qty, threshold, id]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query(
    "DELETE FROM ingredients WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

async function adjustStock(id, delta, client = pool) {
  const result = await client.query(
    `UPDATE ingredients
     SET stock_qty = stock_qty + $1, updated_at = now()
     WHERE id = $2
     RETURNING *`,
    [delta, id]
  );
  return result.rows[0];
}

module.exports = { findAll, findById, create, update, remove, adjustStock };