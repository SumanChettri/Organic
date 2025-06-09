const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const os = require('os'); // <-- New import
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const shopRoutes = require('./routes/shop');
const productRoutes = require('./routes/products');
const productDetailsRoutes = require('./routes/productDetails');
const categoriesRoutes = require('./routes/categories');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/orders');
const AdminLogin = require('./routes/adminAuth');
const app = express();
const port = process.env.PORT || 5000;

// 🔍 Get local IP address dynamically
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIPAddress = getLocalIPAddress();

// Middleware
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, '../public/images')));

const corsOptions = {
  origin: [`http://${localIPAddress}:3000`, 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// API Routes
app.use('/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/shop', shopRoutes);
app.use('/api', productRoutes);
app.use('/api', productDetailsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/stats', dashboardRoutes);
app.use('/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/admin', AdminLogin);

// Test Endpoint for JWT_SECRET
app.get('/test-secret', (req, res) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "JWT_SECRET is not loaded properly" });
  }
  res.json({ message: "JWT_SECRET is working!" });
});

// Start Server After Database Sync
sequelize.sync()
  .then(() => {
    console.log('Database schema updated successfully!');
    app.listen(port, () => {
      console.log(`Server running at:`);
      console.log(`http://${localIPAddress}:${port}`);
      console.log(`http://localhost:${port}`);
      console.log("JWT Secret:", process.env.JWT_SECRET);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
