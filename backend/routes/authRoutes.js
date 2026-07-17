const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const upload = require("../middleware/upload");

// Login
router.post("/login", authController.login);

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