const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: { type: DataTypes.TEXT, allowNull: false, unique: true },
    password: { type: DataTypes.TEXT, allowNull: false },
    first_name: { type: DataTypes.TEXT },
    last_name: { type: DataTypes.TEXT },

    mobile: { type: DataTypes.TEXT, allowNull: true },
    reset_password_token: { type: DataTypes.STRING },
    reset_password_expires: { type: DataTypes.DATE },
    ...basicModelFields,
  },
  {
    tableName: "users",
    timestamps: false, // kyunke tum already created_at/updated_at handle kar rahe ho
  }
);

module.exports = User;
