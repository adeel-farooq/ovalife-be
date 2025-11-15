const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const NotificationSetting = sequelize.define(
  "NotificationSetting",
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
    notification_type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    toast_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    email_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    sms_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ...basicModelFields,
  },
  {
    tableName: "notification_settings",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "notification_type"],
      },
    ],
  }
);

module.exports = NotificationSetting;
