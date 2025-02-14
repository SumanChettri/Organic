const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');
const Product = require('./Product');

const Cart = sequelize.define('Cart', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

// Define associations
Cart.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Cart, { foreignKey: 'productId' });

module.exports = Cart;