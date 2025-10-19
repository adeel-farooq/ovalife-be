const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const UserFilter = sequelize.define(
  "UserFilter",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    donor_code: {
      type: DataTypes.STRING(36),
      allowNull: false,
      unique: true,
    },
    race: {
      type: DataTypes.STRING(36),
    },
    hair_color: {
      type: DataTypes.STRING(36),
    },
    eye_color: {
      type: DataTypes.STRING(36),
    },
    education_level: {
      type: DataTypes.STRING(100),
    },
    height_cm: {
      type: DataTypes.DECIMAL(5, 2),
    },
    blood_type: {
      type: DataTypes.STRING(10),
    },
    identification: {
      type: DataTypes.STRING(50),
    },
    available_for_fresh_cycles: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ...basicModelFields,
  },
  {
    tableName: "user_filters",
    timestamps: false,
    underscored: true,
  }
);

module.exports = UserFilter;
