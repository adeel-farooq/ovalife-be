const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");
const basicModelFields = require("../basicFields");

const EmailInvitation = sequelize.define(
  "EmailInvitation",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    invitation_type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recipient_email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recipient_phone: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recipient_role: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    invitation_link: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "sent",
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    opened_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    accepted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ...basicModelFields,
  },
  {
    tableName: "email_invitations",
    timestamps: false,
  }
);

module.exports = EmailInvitation;
