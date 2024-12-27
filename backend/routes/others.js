const express = require('express');
const pool = require('../db/connection'); // Import the connection pool

const router = express.Router();

// Route to get the number of products and distinct categories
router.get('/stats', async (req, res) => {
  try {
    // Query to get the number of products
    const [productCountRows] = await pool.execute('SELECT COUNT(*) AS productCount FROM products');
    const productCount = productCountRows[0].productCount;

    // Query to get the number of distinct categories
    const [categoryCountRows] = await pool.execute('SELECT COUNT(DISTINCT category) AS categoryCount FROM products');
    const categoryCount = categoryCountRows[0].categoryCount;

    res.status(200).json({
      productCount,
      categoryCount,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;