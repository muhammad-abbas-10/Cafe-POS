const pool = require("../config/db");

async function findAll() {
  const result = await pool.query(
    "SELECT * FROM categories ORDER BY sort_order ASC"
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM categories WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function create({ name, sort_order }) {
  const result = await pool.query(
    `INSERT INTO categories (name, sort_order)
     VALUES ($1, $2)
     RETURNING *`,
    [name, sort_order]
  );
  return result.rows[0];
}

async function update(id, { name, sort_order }) {
  const result = await pool.query(
    `UPDATE categories
     SET name = $1, sort_order = $2, updated_at = now()
     WHERE id = $3
     RETURNING *`,
    [name, sort_order, id]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query(
    "DELETE FROM categories WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

module.exports = { findAll, findById, create, update, remove };