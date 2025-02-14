const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Database name
  process.env.DB_USER,     // Database username
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Database host
    dialect: 'mysql',          // Specify MySQL as the database dialect
    logging: false,            // Disable SQL query logging (optional)
    pool: {
      max: 5,    // Maximum number of connections in the pool
      min: 0,    // Minimum number of connections in the pool
      acquire: 30000, // Maximum time (ms) to acquire a connection
      idle: 10000    // Maximum time (ms) a connection can be idle
    },
  }
);

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;