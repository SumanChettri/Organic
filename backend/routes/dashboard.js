const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // Assuming you have a db module to handle database connections

// Endpoint to get statistics
router.get('/', async (req, res) => {
  try {
    const productCountQuery = 'SELECT COUNT(*) AS productCount FROM products';
    const categoryCountQuery = 'SELECT COUNT(DISTINCT category) AS categoryCount FROM products';
    const orderCountQuery = 'SELECT COUNT(*) AS orderCount FROM orders';

    const [productCountResult] = await db.query(productCountQuery);
    const [categoryCountResult] = await db.query(categoryCountQuery);
    const [orderCountResult] = await db.query(orderCountQuery);

    res.json({
      productCount: productCountResult[0].productCount,
      categoryCount: categoryCountResult[0].categoryCount,
      orderCount: orderCountResult[0].orderCount,
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;