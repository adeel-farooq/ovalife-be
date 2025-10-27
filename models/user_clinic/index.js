const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");

const UserClinic = sequelize.define(
  "UserClinic",
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
    clinic_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "user_clinics",
    timestamps: false,
  }
);

module.exports = UserClinic;
