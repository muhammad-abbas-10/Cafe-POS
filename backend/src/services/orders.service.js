const pool = require("../config/db");
const ordersRepository = require("../repositories/orders.repository");
const menuItemsRepository = require("../repositories/menuItems.repository");
const addonsRepository = require("../repositories/addons.repository");
const staffRepository = require("../repositories/staff.repository");
const settingsRepository = require("../repositories/settings.repository");
const ApiError = require("../utils/ApiError");

const ORDER_TYPES = ["dine-in", "takeaway", "delivery"];
const PAYMENT_METHODS = ["cash", "card", "e-wallet", "split"];
const STATUSES = ["completed", "voided", "refunded"];

function round2(n) {
  return Math.round(n * 100) / 100;
}

async function getSettingNumber(key, fallback) {
  const setting = await settingsRepository.findByKey(key);
  if (!setting) return fallback;
  const n = Number(setting.value);
  return isNaN(n) ? fallback : n;
}

async function getAllOrders() {
  return ordersRepository.findAll();
}

async function getOrderById(id) {
  const order = await ordersRepository.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const lines = await ordersRepository.findLinesByOrderId(id);
  const lineIds = lines.map((l) => l.id);
  const addons = await ordersRepository.findAddonsByLineIds(lineIds);

  const linesWithAddons = lines.map((line) => ({
    ...line,
    addons: addons.filter((a) => a.order_line_id === line.id),
  }));

  return { ...order, lines: linesWithAddons };
}

async function createOrder({
  order_type,
  table_or_address,
  staff_id,
  payment_method,
  lines,
}) {
  // --- Validate top-level fields ---
  if (!ORDER_TYPES.includes(order_type)) {
    throw new ApiError(400, `order_type must be one of: ${ORDER_TYPES.join(", ")}`);
  }
  if (!PAYMENT_METHODS.includes(payment_method)) {
    throw new ApiError(400, `payment_method must be one of: ${PAYMENT_METHODS.join(", ")}`);
  }
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new ApiError(400, "At least one order line is required");
  }
  if (staff_id) {
    const staff = await staffRepository.findById(staff_id);
    if (!staff) {
      throw new ApiError(400, "staff_id does not match an existing staff member");
    }
  }

  // --- Validate + snapshot each line, and each line's addons ---
  const resolvedLines = [];
  for (const line of lines) {
    if (!line.menu_item_id) {
      throw new ApiError(400, "Each order line requires a menu_item_id");
    }
    if (!Number.isInteger(line.qty) || line.qty <= 0) {
      throw new ApiError(400, "Each order line requires a qty that is a positive integer");
    }

    const menuItem = await menuItemsRepository.findById(line.menu_item_id);
    if (!menuItem) {
      throw new ApiError(400, `menu_item_id ${line.menu_item_id} does not match an existing item`);
    }
    if (!menuItem.is_available) {
      throw new ApiError(400, `"${menuItem.name}" is currently unavailable`);
    }

    const addonIds = line.addon_ids ?? [];
    const resolvedAddons = [];
    for (const addonId of addonIds) {
      const addon = await addonsRepository.findById(addonId);
      if (!addon) {
        throw new ApiError(400, `addon_id ${addonId} does not match an existing addon`);
      }
      if (!addon.active) {
        throw new ApiError(400, `"${addon.name}" is not currently available`);
      }
      resolvedAddons.push(addon);
    }

    const unitPrice = Number(menuItem.price);
    const addonsTotal = resolvedAddons.reduce((sum, a) => sum + Number(a.price), 0);
    const lineTotal = round2((unitPrice + addonsTotal) * line.qty);

    resolvedLines.push({
      menu_item_id: menuItem.id,
      name_snapshot: menuItem.name,
      unit_price_snapshot: unitPrice,
      qty: line.qty,
      size: line.size,
      temperature: line.temperature,
      sugar: line.sugar,
      ice: line.ice,
      note: line.note,
      line_total: lineTotal,
      addons: resolvedAddons,
    });
  }

  // --- Compute real totals server-side, never trust client math ---
  const subtotal = round2(resolvedLines.reduce((sum, l) => sum + l.line_total, 0));
  const taxRate = await getSettingNumber("tax_rate", 0);
  const tax = round2(subtotal * (taxRate / 100));
  const deliveryFee =
    order_type === "delivery" ? await getSettingNumber("delivery_fee", 0) : 0;
  const total = round2(subtotal + tax + deliveryFee);

  const order_number = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // --- Run everything in one transaction ---
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const order = await ordersRepository.insertOrder(
      {
        order_number,
        order_type,
        table_or_address: table_or_address ?? null,
        staff_id: staff_id ?? null,
        subtotal,
        delivery_fee: deliveryFee,
        tax,
        total,
        payment_method,
      },
      client
    );

    const savedLines = [];
    for (const line of resolvedLines) {
      const savedLine = await ordersRepository.insertOrderLine(
        { order_id: order.id, ...line },
        client
      );

      const savedAddons = [];
      for (const addon of line.addons) {
        const savedAddon = await ordersRepository.insertOrderLineAddon(
          {
            order_line_id: savedLine.id,
            addon_id: addon.id,
            price_snapshot: addon.price,
          },
          client
        );
        savedAddons.push(savedAddon);
      }

      savedLines.push({ ...savedLine, addons: savedAddons });
    }

    await client.query("COMMIT");
    return { ...order, lines: savedLines };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function updateOrderStatus(id, status) {
  await getOrderById(id); // throws 404 if it doesn't exist

  if (!STATUSES.includes(status)) {
    throw new ApiError(400, `status must be one of: ${STATUSES.join(", ")}`);
  }

  return ordersRepository.updateStatus(id, status);
}

module.exports = { getAllOrders, getOrderById, createOrder, updateOrderStatus };