#!/usr/bin/env node
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { sequelize } = require("../db");
const { Sequelize } = require("sequelize");

async function run() {
  try {
    const migrationsDir = path.join(__dirname, "..", "migrations");
    if (!fs.existsSync(migrationsDir)) {
      console.log("No migrations directory found");
      process.exit(0);
    }
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".js"))
      .sort();
    const queryInterface = sequelize.getQueryInterface();
    for (const f of files) {
      const migrationPath = path.join(migrationsDir, f);
      console.log("Applying migration:", f);
      const migration = require(migrationPath);
      if (migration && typeof migration.up === "function") {
        await migration.up(queryInterface, Sequelize);
      } else {
        console.log("Skipping file (no up export):", f);
      }
    }
    console.log("Migrations complete");
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error("Migration failed", err);
    try {
      await sequelize.close();
    } catch (_) {}
    process.exit(1);
  }
}

run();
