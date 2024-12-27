const express = require('express');
const authenticateToken = require('../middleware/auth'); // Ensure the path is correct
const pool = require('../db/connection');
const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
    try {
        const query = `
            SELECT cart.id, cart.quantity, products.name, products.price, products.image
            FROM cart
            JOIN products ON cart.product_id = products.id
            WHERE cart.user_id = ?
        `;
        const [rows] = await pool.execute(query, [req.user.id]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add to cart
router.post('/', authenticateToken, async (req, res) => {
    const { product_id, quantity } = req.body;
    try {
        console.log('Adding to cart:', { user_id: req.user.id, product_id, quantity }); // Log the request data
        const query = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
        await pool.execute(query, [req.user.id, product_id, quantity]);
        res.status(201).json({ message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const cartId = req.params.id;
    const { quantity } = req.body;
    try {
        const query = 'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?';
        await pool.execute(query, [quantity, cartId, req.user.id]);
        res.status(200).json({ message: 'Quantity updated' });
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Remove from cart
router.delete('/:id', authenticateToken, async (req, res) => {
    const cartId = req.params.id;
    try {
        const query = 'DELETE FROM cart WHERE id = ? AND user_id = ?';
        await pool.execute(query, [cartId, req.user.id]);
        res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;