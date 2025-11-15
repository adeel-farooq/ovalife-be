const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const EmailTemplate = sequelize.define(
  "EmailTemplate",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    template_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    template_type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sender_email: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cta_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cta_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    check_account_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    check_account_email: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    social_twitter_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    social_facebook_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    social_instagram_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "draft",
    },
    created_by_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ...basicModelFields,
  },
  {
    tableName: "email_templates",
    timestamps: false,
  }
);

module.exports = EmailTemplate;
