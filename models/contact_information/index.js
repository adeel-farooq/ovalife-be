const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const ContactInformation = sequelize.define(
  "ContactInformation",
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
    address_line_1: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address_line_2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: false,
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
      allowNull: false,
    },
    phone_country_code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    consent_to_messages: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ...basicModelFields,
  },
  {
    tableName: "contact_information",
    timestamps: false,
    underscored: true,
  }
);

module.exports = ContactInformation;
