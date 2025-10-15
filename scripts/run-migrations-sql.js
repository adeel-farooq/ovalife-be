// Roman Urdu: Yeh script sirf .sql migrations ko run karegi jab tum command doge.
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { sequelize } = require("../db");

async function run() {
  try {
    const migrationsDir = path.join(__dirname, "..", "migrations");
    if (!fs.existsSync(migrationsDir)) {
      console.log("No migrations directory found");
      process.exit(0);
    }
    // Ensure migrations tracking table exists
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const f of files) {
      // Check if file already applied
      const [rows] = await sequelize.query(
        "SELECT filename FROM migrations WHERE filename = :fn",
        { replacements: { fn: f } }
      );
      if (rows && rows.length) {
        console.log("Skipping (already applied):", f);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, f), "utf8");
      if (!sql.trim()) {
        console.log("Skipping (empty):", f);
        continue;
      }

      console.log("Running:", f);
      try {
        await sequelize.query(sql);
        // Record successful application
        await sequelize.query(
          "INSERT INTO migrations (filename) VALUES (:fn)",
          { replacements: { fn: f } }
        );
      } catch (err) {
        console.error("Migration failed for file:", f, err);
        // Rethrow to trigger outer catch and exit with non-zero
        throw err;
      }
    }
    console.log("SQL migrations complete");
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error("SQL migration failed", err);
    try {
      await sequelize.close();
    } catch (_) {}
    process.exit(1);
  }
}

run();
