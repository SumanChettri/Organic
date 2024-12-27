const express = require('express');
require('dotenv').config(); // Ensure this line loads the .env file
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const shopRoutes = require('./routes/shop');
const productRoutes = require('./routes/products');
const productDetailsRoutes = require('./routes/productDetails');
const categoriesRoutes = require('./routes/categories');
const dashboardRoutes = require('./routes/dashboard');
const jwt = require('jsonwebtoken');
const app = express();
const authenticateToken = require('./middleware/auth');
app.use(express.json());
const port = process.env.PORT || 5000;
const localIPAddress = '192.168.133.156'; // Replace with your local IP address

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, '../public/images')));

const corsOptions = {
  origin: ['http://192.168.133.156:3000', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.get('/test-secret', (req, res) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "JWT_SECRET is not loaded properly" });
  }
  res.json({ message: "JWT_SECRET is working!" });
});
 // This should print your secret

app.use(cors(corsOptions));
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/shop', shopRoutes);
app.use('/api', productRoutes);
app.use('/api', productDetailsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/', dashboardRoutes);

app.listen(port, () => {
  console.log(`Server running at:`);
  console.log(`http://${localIPAddress}:${port}`);
  console.log(`http://localhost:${port}`);
  const JWT_SECRET = process.env.JWT_SECRET;
  console.log("JWT Secret:", JWT_SECRET);

});

  