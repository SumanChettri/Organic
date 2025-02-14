const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize'); // Import Op from Sequelize
const sequelize = require('../db/connection');
const User = require('../models/User');
const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || "fallbackSecretKey";

// Configure multer for profile photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/images/profiles'));
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .jpeg, .jpg, .png files are allowed!'));
  },
});

// Register a new user
router.post('/register', upload.single('profilePhoto'), async (req, res) => {
  const { name, email, password, phone, pincode } = req.body;
  const profilePhoto = req.file ? `/images/profiles/${req.file.filename}` : null;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      pincode,
      profileImage: profilePhoto,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { emailOrName, password } = req.body;

  if (!emailOrName || !password) {
    return res.status(400).json({ message: "Email/Name and password are required" });
  }

  try {
    console.log("Starting database query...");
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrName }, { name: emailOrName }]
      }
    });
    console.log("Database query result:", user);

    if (!user) {
      console.error("User not found");
      return res.status(401).json({ message: "Invalid email/name or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("Password mismatch");
      return res.status(401).json({ message: "Invalid email/name or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: "2h",
    });

    console.log("Login successful for user:", user.email);
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

module.exports = router;