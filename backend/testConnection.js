const pool = require('./db/connection'); // Ensure this points to your connection.js file

(async () => {
    try {
        const connection = await pool.getConnection(); // Try to get a connection
        console.log('Database connected successfully'); // If this works, your connection is fine
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('Error connecting to the database:', err.message); // If this fails, it will show the error
    }
})();
