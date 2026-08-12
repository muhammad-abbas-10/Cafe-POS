const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth.routes");
const requireAuth = require("./middleware/requireAuth");
const { buildCorsOptions } = require("./config/cors");

const app = express();

app.use(cors(buildCorsOptions()));
app.use(express.json({ limit: "5mb" }));

app.use("/api/auth", authRoutes);
app.use("/api", requireAuth, routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
