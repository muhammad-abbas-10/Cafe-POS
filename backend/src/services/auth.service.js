const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

async function login(username, password) {
  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  const validUsername = username === process.env.ADMIN_USERNAME;
  const validPassword = validUsername
    ? await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
    : false;

  if (!validUsername || !validPassword) {
    throw new ApiError(401, "Invalid username or password");
  }

  const token = jwt.sign(
    { username, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  return { token, user: { username, role: "admin" } };
}

module.exports = { login };