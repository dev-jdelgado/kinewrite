const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const fs = require("fs");
const path = require("path");

exports.login = async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and Password are required."
            });
        }

        const admin = await Admin.findByUsername(username);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            admin.admin_password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign(
            {
                admin_id: admin.admin_id,
                username: admin.admin_user
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        return res.json({
            success: true,
            token,
            admin: {
                id: admin.admin_id,
                name: admin.admin_name,
                username: admin.admin_user,
                email: admin.admin_email,
                school: admin.admin_school,
                phone: admin.admin_phone,
                profile_image: admin.profile_image
            }
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {

        const { id, name, email, school, phone } = req.body;

        // Get the old image filename from the database
        const oldImage = await Admin.getProfileImage(id);

        // If a new image was uploaded, delete the old one
        if (req.file && oldImage?.profile_image) {

            const imagePath = path.join(
                __dirname,
                "../uploads",
                oldImage.profile_image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Get the new uploaded filename
        const profileImage = req.file
            ? req.file.filename
            : oldImage?.profile_image;

        // Update profile
        await Admin.updateProfile(
            id,
            name,
            email,
            school,
            phone,
            profileImage
        );

        return res.json({
            success: true,
            profile_image: profileImage,
            message: "Profile updated successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/* for changing of password */

exports.changePassword = async (req, res) => {

    try {

        const {
            id,
            currentPassword,
            newPassword
        } = req.body;

        const admin = await Admin.findById(id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }

        const match = await bcrypt.compare(
            currentPassword,
            admin.admin_password
        );

        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await Admin.updatePassword(
            id,
            hashedPassword
        );

        return res.json({
            success: true,
            message: "Password changed successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
