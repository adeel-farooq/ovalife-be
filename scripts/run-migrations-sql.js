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
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();
    for (const f of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, f), "utf8");
      if (sql.trim()) {
        console.log("Running:", f);
        await sequelize.query(sql);
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
