const pool = require("../config/db");

async function findByMenuItemId(menuItemId) {
  const result = await pool.query(
    `SELECT ii.menu_item_id, ii.ingredient_id, ii.quantity,
            i.name, i.unit, i.stock_qty
     FROM item_ingredients ii
     JOIN ingredients i ON i.id = ii.ingredient_id
     WHERE ii.menu_item_id = $1
     ORDER BY i.name ASC`,
    [menuItemId]
  );
  return result.rows;
}

async function replaceForMenuItem(menuItemId, recipe) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM item_ingredients WHERE menu_item_id = $1", [menuItemId]);
    for (const row of recipe) {
      await client.query(
        `INSERT INTO item_ingredients (menu_item_id, ingredient_id, quantity)
         VALUES ($1, $2, $3)`,
        [menuItemId, row.ingredient_id, row.quantity]
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
  return findByMenuItemId(menuItemId);
}

async function lockForMenuItems(menuItemIds, client) {
  if (menuItemIds.length === 0) return [];
  const result = await client.query(
    `SELECT ii.menu_item_id, ii.ingredient_id, ii.quantity,
            i.name, i.stock_qty
     FROM item_ingredients ii
     JOIN ingredients i ON i.id = ii.ingredient_id
     WHERE ii.menu_item_id = ANY($1)
     FOR UPDATE OF i`,
    [menuItemIds]
  );
  return result.rows;
}

module.exports = { findByMenuItemId, replaceForMenuItem, lockForMenuItems };
