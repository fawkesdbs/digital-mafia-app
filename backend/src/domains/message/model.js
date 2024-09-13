const sequelize = require('../../config/db');
const { DataTypes } = require('sequelize');

const Message = sequelize.define(
  'Message',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'Users',
        key: 'id',
      },
      field: 'sender_id'
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'Users',
        key: 'id',
      },
      field: 'receiver_id'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Message;
