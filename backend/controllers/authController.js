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
                username: admin.admin_user
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