const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const Section = sequelize.define(
  "Section",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    questionnaire_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "questionnaires",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING, allowNull: false },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
    ...basicModelFields,
  },
  {
    tableName: "sections",
    timestamps: false,
  }
);

module.exports = Section;
