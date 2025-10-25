const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const ConversationMember = sequelize.define('messages', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  member_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message:{
    type:DataTypes.TEXT
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status:{
    type:DataTypes.TEXT
  },
  created_at:{
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at:{
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  deleted_at:{
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'messages',
  timestamps: false,
});

module.exports = ConversationMember;