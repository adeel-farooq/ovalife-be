const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "ovalife",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || null,
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    dialect: "postgres",
    logging: false,
  }
);

module.exports = { sequelize };
