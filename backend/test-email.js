require("dotenv").config();

const transporter = require("./config/email");

async function testEmail() {
    try {
        await transporter.verify();

        console.log("✅ Gmail connection successful!");
    } catch (error) {
        console.error("❌ Gmail connection failed:");
        console.error(error);
    }
}

testEmail();