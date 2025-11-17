const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: { type: DataTypes.TEXT, allowNull: false, unique: true },
    password: { type: DataTypes.TEXT, allowNull: true },
    first_name: { type: DataTypes.TEXT },
    last_name: { type: DataTypes.TEXT },
    is_archived: { type: DataTypes.BOOLEAN, defaultValue: false },
    mobile: { type: DataTypes.TEXT, allowNull: true },
    phone_number: { type: DataTypes.TEXT, allowNull: true },
    profile_picture_url: { type: DataTypes.TEXT, allowNull: true },
    two_factor_enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    two_factor_secret: { type: DataTypes.TEXT, allowNull: true },
    reset_password_token: { type: DataTypes.STRING },
    reset_password_expires: { type: DataTypes.DATE },
    type: { type: DataTypes.STRING, defaultValue: "guest" },
    job_title: { type: DataTypes.STRING, allowNull: true },
    oauth_provider: { type: DataTypes.STRING, allowNull: true },
    google_id: { type: DataTypes.STRING, allowNull: true },
    oauth_access_token: { type: DataTypes.TEXT, allowNull: true },
    oauth_refresh_token: { type: DataTypes.TEXT, allowNull: true },

    ...basicModelFields,
  },
  {
    tableName: "users",
    timestamps: false, // kyunke tum already created_at/updated_at handle kar rahe ho
  }
);

module.exports = User;
