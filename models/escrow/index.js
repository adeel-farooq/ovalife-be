const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const Escrow = sequelize.define(
  "Escrow",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    escrow_number: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    donor_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    clinic_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "action_needed",
    },
    process_status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "initialized_payment",
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.TEXT,
      defaultValue: "USD",
    },
    date_of_match: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    legal_agreement_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ...basicModelFields,
  },
  {
    tableName: "escrows",
    timestamps: false,
  }
);

module.exports = Escrow;
