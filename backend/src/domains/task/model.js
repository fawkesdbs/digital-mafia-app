const sequelize = require("../../config/db");
const { DataTypes } = require("sequelize");

const Task = sequelize.define(
  "Task",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      allowNull: false,
    },
    userRole: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "tasks",
  }
);

module.exports = Task;
