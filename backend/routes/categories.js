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

// Update a category
router.put('/:category', async (req, res) => {
  const { category } = req.params;
  const { newCategory } = req.body;
  try {
    await db.query('UPDATE products SET category = ? WHERE category = ?', [newCategory, category]);
    res.send('Category updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete a category
router.delete('/:category', async (req, res) => {
  const { category } = req.params;
  try {
    await db.query('DELETE FROM products WHERE category = ?', [category]);
    res.send('Category deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;