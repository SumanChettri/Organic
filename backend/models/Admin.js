const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING
}, {
  tableName: 'admins',
  timestamps: false, // adjust as needed
});

module.exports = Admin;