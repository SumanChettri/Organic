const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const pool = require('../db/connection'); // Ensure the path to the connection file is correct
const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || "fallbackSecretKey"; // Use environment variable for security

const JWT_SECRET = 'your_jwt_secret'; // Replace with your secret

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

        const query = 'INSERT INTO users (name, email, password, phone, pincode, profilePhoto) VALUES (?, ?, ?, ?, ?, ?)';
        await pool.execute(query, [name, email, hashedPassword, phone, pincode, profilePhoto]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login a user
router.post("/login", async (req, res) => {
  console.log("Login POST request received");

  const { name, password } = req.body;
  console.log("Login request data:", { name, password });

  try {
    console.log("Starting database query...");
    const [result] = await pool.query("SELECT * FROM users WHERE name = ?", [name]);
    console.log("Database query result length:", result.length);

    if (result.length === 0) {
      console.error("User not found");
      return res.status(401).json({ message: "Invalid name or password" });
    }

    const user = result[0];
    console.log("User found:", user);

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Bcrypt comparison error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!isMatch) {
        console.error("Password mismatch");
        return res.status(401).json({ message: "Invalid name or password" });
      }

      const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      console.log("Login successful for user:", user.name);
      res.status(200).json({ message: "Login successful", token });
    });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Database error" });
  }
});






module.exports = router;