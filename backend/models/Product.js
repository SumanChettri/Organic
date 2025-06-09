const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/connection');

class Product extends Model {}

Product.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priceUnit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true
});

module.exports = Product;