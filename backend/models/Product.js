const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/connection'); // Adjust this path based on your project structure

// Define the Product model
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Makes the 'name' field required
  },
  price: {
    type: DataTypes.FLOAT, // Use FLOAT for decimal values
    allowNull: false, // Makes the 'price' field required
  },
  priceUnit: {
    type: DataTypes.STRING,
    allowNull: false, // Makes the 'priceUnit' field required
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false, // Makes the 'category' field required
  },
  image: {
    type: DataTypes.STRING, // Stores the file path for the image
    allowNull: false, // Makes the 'image' field required
  },
}, {
  tableName: 'products', // Ensure this matches your actual database table name
  timestamps: false, // Set to false if you don't use createdAt/updatedAt fields
});

module.exports = Product;