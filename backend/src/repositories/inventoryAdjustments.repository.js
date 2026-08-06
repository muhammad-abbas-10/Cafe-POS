const pool = require("../config/db");

async function findAll() {
  const result = await pool.query(
    "SELECT * FROM inventory_adjustments ORDER BY created_at DESC"
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM inventory_adjustments WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function findByIngredientId(ingredient_id) {
  const result = await pool.query(
    "SELECT * FROM inventory_adjustments WHERE ingredient_id = $1 ORDER BY created_at DESC",
    [ingredient_id]
  );
  return result.rows;
}

async function create({ ingredient_id, delta, reason, staff_id }, client = pool) {
  const result = await client.query(
    `INSERT INTO inventory_adjustments (ingredient_id, delta, reason, staff_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [ingredient_id, delta, reason, staff_id]
  );
  return result.rows[0];
}

module.exports = { findAll, findById, findByIngredientId, create };