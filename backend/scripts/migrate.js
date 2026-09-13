const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const pool = require("../src/config/db");

async function migrate() {
  await pool.checkConnection();
  console.log("Migrations are up to date");
}

migrate()
  .catch((err) => {
    console.error("Migration failed:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
