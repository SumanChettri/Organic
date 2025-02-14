const express = require('express');
const router = express.Router();
const { Order, Product } = require('../models');
const auth = require('../middleware/auth');

// Middleware to check admin role (assuming req.user.isAdmin flag set)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ error: 'Admin access required' });
};

// Create a new order (user endpoint)
router.post('/', auth, async (req, res) => {
  const { product_id, quantity, paymentMethod } = req.body;
  try {
    const newOrder = await Order.create({
      user_id: req.user.id,
      product_id,
      quantity,
      payment_method: paymentMethod,
      status: 'pending'
    });

    res.status(201).json({ message: 'Order placed successfully', orderId: newOrder.id });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Get orders of the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price']
      }]
    });

    const ordersWithProductName = orders.map(order => ({
      id: order.id,
      product_name: order.Product ? order.Product.name : 'Unknown',
      quantity: order.quantity,
      status: order.status
    }));

    res.json(ordersWithProductName);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Admin: Get new orders (pending orders)
router.get('/new', auth, adminOnly, async (req, res) => {
  try {
    const newOrders = await Order.findAll({
      where: { status: 'pending' },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price']
      }]
    });
    res.json(newOrders);
  } catch (error) {
    console.error('Error fetching new orders:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Admin: Approve an order
router.post('/approve', auth, adminOnly, async (req, res) => {
  const { order_id } = req.body;
  try {
    const order = await Order.findByPk(order_id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = 'complete';
    await order.save();
    res.json({ message: 'Order approved successfully', order });
  } catch (error) {
    console.error('Error approving order:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Admin: Update order status
router.put('/:id', auth, adminOnly, async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    await order.save();
    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Admin: Cancel an order
router.delete('/:id', auth, adminOnly, async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Admin: Get all orders (order management)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price']
      }]
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;