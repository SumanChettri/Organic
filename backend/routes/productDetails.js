const express = require('express');
const pool = require('../db/connection');

const router = express.Router();

router.get('/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    const query = 'SELECT * FROM products WHERE id = ?';
    const [rows] = await pool.execute(query, [productId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = rows[0];
    const imagePath = `${req.protocol}://${req.headers.host}/images/${rows[0].image}`;

    console.log('Image Path:', imagePath); // Debug: Check what URL is being sent

    res.status(200).json({ ...product, images: [imagePath] });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
