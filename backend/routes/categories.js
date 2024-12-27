const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Fetch distinct categories from the products table
router.get('/', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT DISTINCT category FROM products');
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;