const path = require('path');

module.exports = {
  // Other configurations...
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify')
    }
  }
};