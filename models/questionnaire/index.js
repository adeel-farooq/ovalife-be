const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const Questionnaire = sequelize.define(
  "Questionnaire",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_publish: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
    ...basicModelFields,
  },
  {
    tableName: "questionnaires",
    timestamps: false,
  }
);

module.exports = Questionnaire;
