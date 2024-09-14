const sequelize = require("../../config/db");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: true, // Optional
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true, // Optional
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true, // Optional
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Can be null for Google auth
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
  },
  {
    timestamps: false,
  }
);

module.exports = User;

