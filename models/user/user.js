const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicFields = require("../basicFields");
const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.TEXT, allowNull: false, unique: true },
    password_hash: { type: DataTypes.TEXT, allowNull: false },
    firstname: { type: DataTypes.TEXT },
    lastname: { type: DataTypes.TEXT },
    ...basicFields,
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = User;
