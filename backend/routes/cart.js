const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Fetch cart items for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching cart items for user:', userId);

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'image'],
        },
      ],
    });

    console.log('Fetched cart items:', JSON.stringify(cartItems, null, 2));
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add to cart
router.post('/', authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const userId = req.user.id;
    console.log('Adding to cart:', { userId, productId, quantity });

    const existingItem = await Cart.findOne({ where: { userId, productId } });

    if (existingItem) {
      await existingItem.update({ quantity: existingItem.quantity + quantity });
      return res.status(200).json({ message: 'Cart updated successfully' });
    }

    const cartItem = await Cart.create({ userId, productId, quantity });
    res.status(201).json({ message: 'Product added to cart', cartItem });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update cart quantity
router.put('/:id', authenticateToken, async (req, res) => {
  const cartId = req.params.id;
  const { quantity } = req.body;
  try {
    const userId = req.user.id;
    const cartItem = await Cart.findOne({ where: { id: cartId, userId } });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.update({ quantity });
    res.status(200).json({ message: 'Quantity updated successfully' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Remove from cart
router.delete('/:id', authenticateToken, async (req, res) => {
  const cartId = req.params.id;
  try {
    const userId = req.user.id;
    const cartItem = await Cart.findOne({ where: { id: cartId, userId } });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.destroy();
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;