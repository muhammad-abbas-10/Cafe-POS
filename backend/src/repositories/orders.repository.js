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
    payment_details,
    receipt_settings,
  },
  client = pool
) {
  const result = await client.query(
    `INSERT INTO orders
       (order_number, order_type, table_or_address, status, staff_id,
        subtotal, delivery_fee, tax, total, payment_method, payment_details, receipt_settings)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
      JSON.stringify(payment_details || {}),
      JSON.stringify(receipt_settings || {}),
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

async function getReportSummary() {
  const [summaryResult, hourlyResult, topSellersResult] = await Promise.all([
    pool.query(
      `SELECT
         COALESCE(SUM(total) FILTER (WHERE status = 'completed'), 0) AS total_sales,
         COUNT(*) FILTER (WHERE status = 'completed') AS completed_orders,
         COUNT(*) FILTER (WHERE status IN ('refunded', 'voided')) AS refunds
       FROM orders`
    ),
    pool.query(
      `SELECT EXTRACT(HOUR FROM created_at AT TIME ZONE 'Asia/Karachi')::int AS hour,
              COUNT(*)::int AS orders,
              COALESCE(SUM(total), 0) AS sales
       FROM orders
       WHERE status = 'completed'
       GROUP BY hour
       ORDER BY hour`
    ),
    pool.query(
      `SELECT ol.menu_item_id, ol.name_snapshot AS name,
              SUM(ol.qty)::int AS quantity,
              COALESCE(SUM(ol.line_total), 0) AS revenue
       FROM order_lines ol
       JOIN orders o ON o.id = ol.order_id
       WHERE o.status = 'completed'
       GROUP BY ol.menu_item_id, ol.name_snapshot
       ORDER BY quantity DESC, revenue DESC, name ASC
       LIMIT 10`
    ),
  ]);

  return {
    summary: summaryResult.rows[0],
    hourly: hourlyResult.rows,
    top_sellers: topSellersResult.rows,
  };
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
  getReportSummary,
};
