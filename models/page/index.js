const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const Page = sequelize.define(
  "Page",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    section_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "sections",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: { type: DataTypes.STRING, allowNull: false },
    tools: { type: DataTypes.JSONB },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
    ...basicModelFields,
  },
  {
    tableName: "pages",
    timestamps: false,
  }
);

module.exports = Page;
