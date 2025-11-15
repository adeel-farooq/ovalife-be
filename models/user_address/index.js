const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const UserAddress = sequelize.define(
  "UserAddress",
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
    address_type: {
      type: DataTypes.TEXT,
      defaultValue: "home",
    },
    address_line_1: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address_line_2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    zip_code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    ...basicModelFields,
  },
  {
    tableName: "user_addresses",
    timestamps: false,
  }
);

module.exports = UserAddress;
