// backend/routes/orders.js

const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // Assuming you have an Order model

// Endpoint to get order count
router.get("/count", async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Error fetching order count", error: err });
  }
});

module.exports = router;
