const ApiError = require("../utils/ApiError");

function notFound(req, res, next) {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
  next(error);
}

module.exports = notFound;