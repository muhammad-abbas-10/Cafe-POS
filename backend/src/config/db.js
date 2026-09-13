const fs = require("fs");
const path = require("path");

let databasePromise;
let queue = Promise.resolve();

async function acquire() {
  const previous = queue;
  let release;
  queue = new Promise((resolve) => {
    release = resolve;
  });
  await previous;
  return release;
}

function migrationFiles() {
  const migrationsDir = path.join(__dirname, "..", "..", "migrations");
  const files = fs.readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map((file) => ({
      name: file,
      sql: fs.readFileSync(path.join(migrationsDir, file), "utf8"),
    }));

  if (process.env.SEED_LOCAL_DB !== "false") {
    const seedName = "local/004_seed.sql";
    files.push({
      name: seedName,
      sql: fs.readFileSync(
        path.join(__dirname, "..", "..", "local-db", "004_seed.sql"),
        "utf8"
      ),
    });
  }

  return files;
}

async function initializeDatabase() {
  const { PGlite } = await import("@electric-sql/pglite");
  const dataDir = path.resolve(
    __dirname,
    "..",
    "..",
    process.env.PGLITE_DATA_DIR || ".data/cafe-pos"
  );
  fs.mkdirSync(path.dirname(dataDir), { recursive: true });
  const database = await PGlite.create(dataDir);

  await database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  for (const migration of migrationFiles()) {
    const applied = await database.query(
      "SELECT 1 FROM schema_migrations WHERE name = $1",
      [migration.name]
    );
    if (applied.rows.length > 0) continue;

    await database.transaction(async (transaction) => {
      await transaction.exec(migration.sql);
      await transaction.query(
        "INSERT INTO schema_migrations (name) VALUES ($1)",
        [migration.name]
      );
    });
  }

  return database;
}

function getDatabase() {
  if (!databasePromise) {
    databasePromise = initializeDatabase().catch((error) => {
      databasePromise = undefined;
      throw error;
    });
  }
  return databasePromise;
}

async function query(sql, params) {
  const release = await acquire();
  try {
    const database = await getDatabase();
    return await database.query(sql, params);
  } finally {
    release();
  }
}

async function connect() {
  const releaseLock = await acquire();
  try {
    const database = await getDatabase();
    let released = false;
    return {
      query(sql, params) {
        if (released) throw new Error("Database client has already been released");
        return database.query(sql, params);
      },
      release() {
        if (released) return;
        released = true;
        releaseLock();
      },
    };
  } catch (error) {
    releaseLock();
    throw error;
  }
}

async function checkConnection() {
  try {
    await query("SELECT 1");
    console.log("Embedded database connected successfully");
  } catch (error) {
    console.error("Embedded database failed:", error.message);
    throw error;
  }
}

async function end() {
  if (!databasePromise) return;
  const database = await databasePromise;
  await database.close();
  databasePromise = undefined;
}

module.exports = {
  query,
  connect,
  checkConnection,
  end,
};
