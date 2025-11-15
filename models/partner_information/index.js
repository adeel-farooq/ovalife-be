const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const PartnerInformation = sequelize.define(
  "PartnerInformation",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profile_picture_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ...basicModelFields,
  },
  {
    tableName: "partner_information",
    timestamps: false,
  }
);

module.exports = PartnerInformation;
