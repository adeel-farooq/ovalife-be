const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicModelFields");

const PhysicalCharacteristics = sequelize.define(
  "PhysicalCharacteristics",
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
    subject_type: {
      type: DataTypes.TEXT,
      defaultValue: "self",
    },
    ethnicity: DataTypes.TEXT,
    hair_color: DataTypes.TEXT,
    eye_color: DataTypes.TEXT,
    skin_tone: DataTypes.TEXT,
    height: DataTypes.DECIMAL(5, 2),
    weight: DataTypes.DECIMAL(5, 2),
    blood_type: DataTypes.TEXT,
    profile_image_path: DataTypes.TEXT,
    interest_sharing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    egg_cycle_preference: DataTypes.TEXT,
    pre_genetic_test: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ...basicModelFields,
  },
  {
    tableName: "physical_characteristics",
    timestamps: false,
    underscored: true,
  }
);

module.exports = PhysicalCharacteristics;
