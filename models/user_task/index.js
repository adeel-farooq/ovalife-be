const { sequelize } = require("../../db");
const { DataTypes } = require("sequelize");

const UserTask = sequelize.define(
  "UserTask",
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
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "user_tasks",
    timestamps: false,
  }
);

module.exports = UserTask;
