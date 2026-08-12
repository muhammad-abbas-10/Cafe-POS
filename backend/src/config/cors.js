const LOCAL_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

function normalizeOrigin(value) {
  try {
    return new URL(value.trim()).origin;
  } catch {
    return null;
  }
}

function configuredOrigins() {
  const configured = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

  if (configured.length > 0) return new Set(configured);
  return new Set(process.env.NODE_ENV === "production" ? [] : LOCAL_ORIGINS);
}

function buildCorsOptions() {
  const allowedOrigins = configuredOrigins();
  return {
    origin(origin, callback) {
      // Non-browser clients do not send Origin and are not governed by CORS.
      if (!origin) return callback(null, true);
      return callback(null, allowedOrigins.has(normalizeOrigin(origin)));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    maxAge: 600,
  };
}

module.exports = { buildCorsOptions };
