const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const TwoFactorDevice = sequelize.define(
  "TwoFactorDevice",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    device_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    device_type: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    last_used_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ...basicModelFields,
  },
  {
    tableName: "two_factor_devices",
    timestamps: false,
  }
);

module.exports = TwoFactorDevice;
