const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Admin = require('../models/Admin'); // Updated to use the Admin model
const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || "fallbackSecretKey";

// POST /admin/login => Admin login route
router.post('/login', async (req, res) => {
  const { emailOrName, password } = req.body;
  if (!emailOrName || !password) {
    return res.status(400).json({ message: "Email/Name and password are required" });
  }

  try {
    const admin = await Admin.findOne({
      where: {
        [Op.or]: [{ email: emailOrName }, { name: emailOrName }]
      }
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Issue token with admin flag true
    const token = jwt.sign({ id: admin.id, isAdmin: true }, jwtSecret, { expiresIn: "2h" });
    res.status(200).json({ message: "Admin login successful", token });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;