const bcrypt = require("bcrypt");

async function generatePassword() {
    const password = "Nicole@2026";

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);
}

generatePassword();