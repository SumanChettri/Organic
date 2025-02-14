const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/connection');
const Order = require('./order');
const Product = require('./Product'); // Yahan aapka product model hona chahiye



// Define the Order model


// Define associations
Order.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Order, { foreignKey: 'product_id' });

module.exports = { Order, Product, sequelize };