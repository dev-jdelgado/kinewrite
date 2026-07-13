const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

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
                phone: admin.admin_phone
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

        await Admin.updateProfile(id, name, email, school, phone);

        return res.json({
            success: true,
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