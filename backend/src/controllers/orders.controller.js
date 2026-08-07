const ordersService = require("../services/orders.service");

async function getAll(req, res) {
  const orders = await ordersService.getAllOrders();
  res.json(orders);
}

async function getById(req, res) {
  const order = await ordersService.getOrderById(req.params.id);
  res.json(order);
}

async function create(req, res) {
  const order = await ordersService.createOrder(req.body);
  res.status(201).json(order);
}

async function updateStatus(req, res) {
  const order = await ordersService.updateOrderStatus(req.params.id, req.body.status);
  res.json(order);
}

module.exports = { getAll, getById, create, updateStatus };