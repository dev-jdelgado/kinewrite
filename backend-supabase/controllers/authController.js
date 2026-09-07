const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const db = require("../config/db");

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
                username: admin.admin_user,
                school_id: admin.school_id
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
                school_id: admin.school_id,
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

exports.signup = async (req, res) => {
    let connection;

    try {
        const {
            schoolName,
            schoolCode,
            adminName,
            username,
            email,
            password,
            confirmPassword
        } = req.body;

        // =========================
        // VALIDATION
        // =========================

        if (
            !schoolName ||
            !schoolCode ||
            !adminName ||
            !username ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "Please complete all required fields."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });
        }

        // =========================
        // CHECK SCHOOL CODE
        // =========================

        const { rows: existingSchool } = await db.query(
            "SELECT school_id FROM schools WHERE school_code = $1",
            [schoolCode.trim()]
        );

        if (existingSchool.length > 0) {
            return res.status(409).json({
                success: false,
                message: "School code is already registered."
            });
        }

        // =========================
        // CHECK USERNAME
        // =========================

        const { rows: existingUsername } = await db.query(
            "SELECT admin_id FROM admin WHERE admin_user = $1",
            [username.trim()]
        );

        if (existingUsername.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Username is already taken."
            });
        }

        // =========================
        // CHECK EMAIL
        // =========================

        const { rows: existingEmail } = await db.query(
            "SELECT admin_id FROM admin WHERE admin_email = $1",
            [email.trim()]
        );

        if (existingEmail.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered."
            });
        }

        // =========================
        // START TRANSACTION
        // =========================

        connection = await db.connect();

        await connection.query("BEGIN");

        // =========================
        // CREATE SCHOOL
        // =========================

        const schoolResult = await connection.query(
            `INSERT INTO schools
                (school_name, school_code)
             VALUES ($1, $2)
             RETURNING school_id`,
            [
                schoolName.trim(),
                schoolCode.trim()
            ]
        );

        const schoolId = schoolResult.rows[0].school_id;

        // =========================
        // HASH PASSWORD
        // =========================

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // =========================
        // CREATE ADMIN
        // =========================

        await connection.query(
            `INSERT INTO admin
                (
                    school_id,
                    admin_name,
                    admin_user,
                    admin_password,
                    admin_email,
                    admin_school
                )
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                schoolId,
                adminName.trim(),
                username.trim(),
                hashedPassword,
                email.trim(),
                schoolName.trim()
            ]
        );

        // =========================
        // COMMIT
        // =========================

        await connection.query("COMMIT");

        return res.status(201).json({
            success: true,
            message: "School account created successfully.",
            school_id: schoolId
        });

    } catch (error) {

        console.error("Signup Error:", error);

        if (connection) {
            await connection.query("ROLLBACK");
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create school account."
        });

    } finally {

        if (connection) {
            connection.release();
        }

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
