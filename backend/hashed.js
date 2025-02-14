const bcrypt = require('bcrypt');
const password = "Tewari@758";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});