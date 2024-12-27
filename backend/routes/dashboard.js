const express = require('express');
const router = express.Router();

// Example route for the dashboard
router.get('/', (req, res) => {
    res.send('Dashboard');
});

module.exports = router;