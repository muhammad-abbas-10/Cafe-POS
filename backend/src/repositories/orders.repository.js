const pool = require("../config/db");

async function findAll() {
  const result = await pool.query(
    "SELECT * FROM orders ORDER BY created_at DESC"
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM orders WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function findLinesByOrderId(orderId) {
  const result = await pool.query(
    "SELECT * FROM order_lines WHERE order_id = $1",
    [orderId]
  );
  return result.rows;
}

async function findAddonsByLineIds(lineIds) {
  if (lineIds.length === 0) return [];
  const result = await pool.query(
    "SELECT * FROM order_line_addons WHERE order_line_id = ANY($1::uuid[])",
    [lineIds]
  );
  return result.rows;
}

async function insertOrder(
  {
    order_number,
    order_type,
    table_or_address,
    status,
    staff_id,
    subtotal,
    delivery_fee,
    tax,
    total,
    payment_method,
  },
  client = pool
) {
  const result = await client.query(
    `INSERT INTO orders
       (order_number, order_type, table_or_address, status, staff_id,
        subtotal, delivery_fee, tax, total, payment_method)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      order_number,
      order_type,
      table_or_address ?? null,
      status ?? "completed",
      staff_id ?? null,
      subtotal,
      delivery_fee,
      tax,
      total,
      payment_method,
    ]
  );
  return result.rows[0];
}

async function insertOrderLine(
  {
    order_id,
    menu_item_id,
    name_snapshot,
    unit_price_snapshot,
    qty,
    size,
    temperature,
    sugar,
    ice,
    note,
    line_total,
  },
  client = pool
) {
  const result = await client.query(
    `INSERT INTO order_lines
       (order_id, menu_item_id, name_snapshot, unit_price_snapshot, qty,
        size, temperature, sugar, ice, note, line_total)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      order_id,
      menu_item_id,
      name_snapshot,
      unit_price_snapshot,
      qty,
      size ?? null,
      temperature ?? null,
      sugar ?? null,
      ice ?? null,
      note ?? "",
      line_total,
    ]
  );
  return result.rows[0];
}

async function insertOrderLineAddon(
  { order_line_id, addon_id, price_snapshot },
  client = pool
) {
  const result = await client.query(
    `INSERT INTO order_line_addons (order_line_id, addon_id, price_snapshot)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [order_line_id, addon_id, price_snapshot]
  );
  return result.rows[0];
}

async function updateStatus(id, status, client = pool) {
  const result = await client.query(
    "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return result.rows[0];
}

module.exports = {
  findAll,
  findById,
  findLinesByOrderId,
  findAddonsByLineIds,
  insertOrder,
  insertOrderLine,
  insertOrderLineAddon,
  updateStatus,
};