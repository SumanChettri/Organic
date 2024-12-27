const express = require("express");
const router = express.Router();
const db = require("../db/connection"); // Ensure the database connection is correct

// Route to fetch products
router.get('/', async (req, res) => { // Endpoint is '/'
    try {
        const [rows] = await db.query('SELECT * FROM products'); // Fetch data from the database
        res.json(rows); // Send response as JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching products'); // Handle errors
    }
});

module.exports = router;