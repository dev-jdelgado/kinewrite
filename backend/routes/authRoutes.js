const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const otpController = require("../controllers/otpController");
console.log("OTP CONTROLLER:", otpController);
console.log("sendSignupOtp:", typeof otpController.sendSignupOtp);
console.log("verifySignupOtp:", typeof otpController.verifySignupOtp);

const upload = require("../middleware/upload");

// Login
router.post("/login", authController.login);

// Signup

router.post("/signup", authController.signup);

// Send Signup OTP

router.post(
    "/send-signup-otp",
    otpController.sendSignupOtp
);

// Verify Signup OTP
router.post(
    "/verify-signup-otp",
    otpController.verifySignupOtp
);

// Update Profile
router.put(
    "/profile",
    upload.single("image"),
    authController.updateProfile
);

// Change Password
router.put(
    "/change-password",
    authController.changePassword
);

module.exports = router;