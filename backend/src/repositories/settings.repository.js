const pool = require("../config/db");

async function findAll() {
  const result = await pool.query(
    "SELECT * FROM settings ORDER BY key ASC"
  );
  return result.rows;
}

async function findByKey(key) {
  const result = await pool.query(
    "SELECT * FROM settings WHERE key = $1",
    [key]
  );
  return result.rows[0];
}

async function upsert(key, value) {
  const result = await pool.query(
    `INSERT INTO settings (key, value)
     VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = $2
     RETURNING *`,
    [key, value]
  );
  return result.rows[0];
}

async function remove(key) {
  const result = await pool.query(
    "DELETE FROM settings WHERE key = $1 RETURNING *",
    [key]
  );
  return result.rows[0];
}

module.exports = { findAll, findByKey, upsert, remove };