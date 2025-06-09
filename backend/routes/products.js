const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

const router = express.Router();

// Path to store images
const imageDir = path.join(__dirname, '../../public/images');

// Ensure image directory exists
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, imageDir),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isValid = allowedTypes.test(file.mimetype) && allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isValid) cb(null, true);
    else cb(new Error('Only .jpeg, .jpg, .png files are allowed!'));
};

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter
});

// Helper to delete image file
const deleteImage = (imagePath) => {
    if (!imagePath) return;
    const fullPath = path.join(__dirname, '../../public', imagePath);
    fs.unlink(fullPath, (err) => {
        if (err) console.warn('Failed to delete image:', err.message);
    });
};

// -------------------- ROUTES --------------------

// POST: Add a new product
router.post('/products', upload.single('image'), async (req, res) => {
    try {
        const { name, price, priceUnit, category } = req.body;
        if (!name || !price || !priceUnit || !category || !req.file) {
            return res.status(400).json({ error: 'All fields are required including an image' });
        }

        const product = await Product.create({
            name,
            price,
            priceUnit,
            category,
            image: `/images/${req.file.filename}`
        });

        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// GET: All products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET: Product by ID
router.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving product' });
    }
});

// DELETE: Product by ID
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        deleteImage(product.image); // Delete image from server
        await product.destroy();

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting product' });
    }
});

// PUT: Update product by ID
router.put('/products/:id', upload.single('image'), async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const { name, price, priceUnit, category } = req.body;
        const updateData = {
            name: name || product.name,
            price: price || product.price,
            priceUnit: priceUnit || product.priceUnit,
            category: category || product.category
        };

        if (req.file) {
            // Delete old image
            deleteImage(product.image);
            updateData.image = `/images/${req.file.filename}`;
        }

        await product.update(updateData);

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating product' });
    }
});

module.exports = router;
