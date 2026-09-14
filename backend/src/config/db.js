const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

function usesLocalDatabase(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

const pool = new Pool({
  connectionString,
  // Vercel instances scale horizontally; one connection per warm instance
  // prevents exhausting Supabase's transaction pooler.
  max: 1,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
  keepAlive: true,
  ssl: usesLocalDatabase(connectionString)
    ? false
    : { rejectUnauthorized: false },
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error.message);
});

function migrationFiles() {
  const migrationsDir = path.join(__dirname, "..", "..", "migrations");
  const files = fs.readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map((file) => ({
      name: file,
      sql: fs.readFileSync(path.join(migrationsDir, file), "utf8"),
    }));

  if (
    process.env.SEED_DATABASE === "true" ||
    process.env.SEED_LOCAL_DB === "true"
  ) {
    files.push({
      name: "local/004_seed.sql",
      sql: fs.readFileSync(
        path.join(__dirname, "..", "..", "local-db", "004_seed.sql"),
        "utf8"
      ),
    });
  }

  return files;
}

let migrationPromise;

async function applyMigrations() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtext($1))",
      ["cafe-pos-migrations"]
    );
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    for (const migration of migrationFiles()) {
      const applied = await client.query(
        "SELECT 1 FROM schema_migrations WHERE name = $1",
        [migration.name]
      );
      if (applied.rowCount > 0) continue;

      await client.query(migration.sql);
      await client.query(
        "INSERT INTO schema_migrations (name) VALUES ($1)",
        [migration.name]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

function migrate() {
  if (!migrationPromise) {
    migrationPromise = applyMigrations().catch((error) => {
      migrationPromise = undefined;
      throw error;
    });
  }
  return migrationPromise;
}

async function checkConnection() {
  await pool.query("SELECT 1");
  await migrate();
  console.log("PostgreSQL database connected successfully");
}

module.exports = {
  query(sql, params) {
    return pool.query(sql, params);
  },
  connect() {
    return pool.connect();
  },
  migrate,
  checkConnection,
  end() {
    return pool.end();
  },
};
