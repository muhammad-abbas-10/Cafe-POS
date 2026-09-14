const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

function passwordsMatch(provided, configured) {
  if (!configured) return false;

  const providedDigest = crypto.createHash("sha256").update(provided).digest();
  const configuredDigest = crypto.createHash("sha256").update(configured).digest();
  return crypto.timingSafeEqual(providedDigest, configuredDigest);
}

async function login(username, password) {
  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  const validUsername = username === process.env.ADMIN_USERNAME;
  const validPassword = validUsername
    ? passwordsMatch(password, process.env.ADMIN_PASSWORD)
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
