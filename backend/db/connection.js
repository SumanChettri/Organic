const mysql = require("mysql2/promise");

// Create a connection pool for the database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Your password here
    database: 'sell', // Your database name here
    waitForConnections: true,
    connectionLimit: 10, // Adjust as needed
    queueLimit: 0,
});

module.exports = pool;
