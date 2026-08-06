const pool = require("../config/db");

async function findAll() {
  const result = await pool.query(
    "SELECT * FROM menu_items ORDER BY created_at ASC"
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM menu_items WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function create({
  category_id,
  name,
  description,
  price,
  image_url,
  is_drink,
  is_available,
}) {
  const result = await pool.query(
    `INSERT INTO menu_items
       (category_id, name, description, price, image_url, is_drink, is_available)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [category_id, name, description, price, image_url, is_drink, is_available]
  );
  return result.rows[0];
}

async function update(id, {
  category_id,
  name,
  description,
  price,
  image_url,
  is_drink,
  is_available,
}) {
  const result = await pool.query(
    `UPDATE menu_items
     SET category_id = $1,
         name = $2,
         description = $3,
         price = $4,
         image_url = $5,
         is_drink = $6,
         is_available = $7,
         updated_at = now()
     WHERE id = $8
     RETURNING *`,
    [category_id, name, description, price, image_url, is_drink, is_available, id]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query(
    "DELETE FROM menu_items WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

module.exports = { findAll, findById, create, update, remove };