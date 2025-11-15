const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const MatchingPreference = sequelize.define(
  "MatchingPreference",
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
    use_intended_parents_picture: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    use_partner_picture: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ...basicModelFields,
  },
  {
    tableName: "matching_preferences",
    timestamps: false,
  }
);

module.exports = MatchingPreference;
