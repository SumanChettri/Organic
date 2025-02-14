const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/connection'); // Apna DB connection import karo

// Order model define karo
const Order = sequelize.define('orders', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  }
}, {
  timestamps: true,         // createdAt aur updatedAt ko enable karta hai
  createdAt: 'created_at',  // createdAt ko 'created_at' ke naam se store karo
  updatedAt: 'updated_at'   // updatedAt ko 'updated_at' ke naam se store karo
});

module.exports = Order;