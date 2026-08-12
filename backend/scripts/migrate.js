const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  const directory = path.join(__dirname, "..", "migrations");
  const files = fs.readdirSync(directory).filter((file) => file.endsWith(".sql")).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(directory, file), "utf8");
    await pool.query(sql);
    console.log(`Applied ${file}`);
  }
}

migrate()
  .catch((err) => {
    console.error("Migration failed:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
