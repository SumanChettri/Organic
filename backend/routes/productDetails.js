const express = require('express');
const Product = require('../models/Product'); // Ensure the path is correct

const router = express.Router();

router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imagePath = `${req.protocol}://${req.headers.host}/images/${product.image}`;

    console.log('Image Path:', imagePath);
    console.log('Product Data:', product);

    res.status(200).json({ ...product.dataValues, images: [imagePath] });
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;