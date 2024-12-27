const bcrypt = require("bcrypt");

const plainPassword = "Tewari@758";
bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (err) {
        console.error("Error hashing password:", err);
    } else {
        console.log("New hashed password:", hash);
    }
});
