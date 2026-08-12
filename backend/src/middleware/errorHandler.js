function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const isPayloadTooLarge = err.type === "entity.too.large" || statusCode === 413;
  const isOperational = err.isOperational || false;

  if (!isOperational && !isPayloadTooLarge) {
    console.error("UNEXPECTED ERROR:", err);
  }

  res.status(statusCode).json({
    error: {
      message: isOperational || isPayloadTooLarge ? err.message : "Something went wrong",
    },
  });
}

module.exports = errorHandler;
