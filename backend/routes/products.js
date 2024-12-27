const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../db/connection'); // Import the connection pool

const router = express.Router();

// Path for the public/images folder
const imageDir = path.join(__dirname, '../../public/images');

// Ensure the 'public/images' folder exists
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageDir);
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

// Add a product
router.post('/products', upload.single('image'), async (req, res) => {
    try {
        const { name, price, priceUnit, category } = req.body;

        // Validate required fields
        if (!name || !price || !priceUnit || !category || !req.file) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const imagePath = `/images/${req.file.filename}`; // Path to the uploaded image

        // Insert the product into the database
        const query = `
            INSERT INTO products (name, price, priceUnit, category, image) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [name, price, priceUnit, category, imagePath]);

        res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all products
router.get('/products', async (req, res) => {
    try {
        const query = 'SELECT * FROM products';
        const [products] = await pool.execute(query);

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a product by ID
router.get('/product/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        const query = 'SELECT * FROM products WHERE id = ?';
        const [rows] = await pool.execute(query, [productId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        const query = 'DELETE FROM products WHERE id = ?';
        const [result] = await pool.execute(query, [productId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a product
router.put('/products/:id', upload.single('image'), async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, price, priceUnit, category } = req.body;
        const imagePath = req.file ? `/images/${req.file.filename}` : null;

        // Check if product exists
        const checkQuery = 'SELECT * FROM products WHERE id = ?';
        const [rows] = await pool.execute(checkQuery, [productId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update the product
        const updateQuery = `
            UPDATE products 
            SET name = ?, price = ?, priceUnit = ?, category = ?, image = COALESCE(?, image) 
            WHERE id = ?
        `;
        await pool.execute(updateQuery, [name, price, priceUnit, category, imagePath, productId]);

        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;