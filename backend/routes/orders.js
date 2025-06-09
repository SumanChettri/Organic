const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/auth');
const { Order, Product, Cart } = require('../models');
router.use(authenticateToken);
const authenticate = require('../middleware/auth');

// Place fake order from cart or product details
// Create fake order (simplified example)
router.post('/fake', async (req, res) => {
  try {
    const { product_id, quantity, payment_method } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    const payMethod = payment_method || 'cod'; // default payment method

    // Assuming Order.create() takes these fields
    const order = await Order.create({
      user_id: 1, // dummy user
      product_id,
      quantity,
      payment_method: payMethod,
    });

    res.json({ message: 'Fake order created successfully', order });
  } catch (error) {
    console.error('Error creating fake order:', error);
    res.status(500).json({ error: 'Failed to create fake order' });
  }
});

// Get all new (pending) orders
router.get('/new', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { status: 'pending' },
      include: [{ model: Product }]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching new orders' });
  }
});

// Add a new order
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: 'Error creating order', error: err.message });
  }
});

// Edit an order
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Order.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedOrder = await Order.findByPk(req.params.id);
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Error updating order', error: err.message });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: 'Order deleted' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Error deleting order', error: err.message });
  }
});

// Approve an order
router.post('/approve', async (req, res) => {
  try {
    const { order_id } = req.body;
    const [updated] = await Order.update({ status: 'approved' }, { where: { id: order_id } });
    if (updated) {
      res.json({ message: 'Order approved' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Error approving order', error: err.message });
  }
});

// Get all orders
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: Product }]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all orders' });
  }
});

router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product }]
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your orders' });
  }
});


module.exports = router;