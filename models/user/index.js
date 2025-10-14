const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");

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
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_by: { type: DataTypes.TEXT },
    updated_by: { type: DataTypes.TEXT },
    mobile: { type: DataTypes.TEXT, allowNull: true },
    reset_password_token: { type: DataTypes.STRING },
    reset_password_expires: { type: DataTypes.DATE },
  },
  {
    tableName: "users",
    timestamps: false, // kyunke tum already created_at/updated_at handle kar rahe ho
  }
);

module.exports = User;
