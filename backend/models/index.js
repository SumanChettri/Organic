const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

const Order = require('./order');
const Product = require('./Product');

// Define associations
Order.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Order, { foreignKey: 'product_id' });

module.exports = { Order, Product, sequelize };
