const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product'); // Import Sequelize Product model

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

        // Insert the product into the database using Sequelize
        const product = await Product.create({
            name,
            price,
            priceUnit,
            category,
            image: imagePath,
        });

        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll(); // Fetch all products
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a product by ID
router.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await product.destroy(); // Delete the product
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a product
router.put('/products/:id', upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const { name, price, priceUnit, category } = req.body;
        const imagePath = req.file ? `/images/${req.file.filename}` : product.image;

        await product.update({
            name: name || product.name,
            price: price || product.price,
            priceUnit: priceUnit || product.priceUnit,
            category: category || product.category,
            image: imagePath,
        });

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
