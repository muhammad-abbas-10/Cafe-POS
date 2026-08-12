const authService = require("../services/auth.service");

async function login(req, res) {
  const result = await authService.login(req.body.username, req.body.password);
  res.json(result);
}

module.exports = { login };