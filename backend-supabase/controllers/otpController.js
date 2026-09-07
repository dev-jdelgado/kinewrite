const bcrypt = require("bcrypt");
const transporter = require("../config/email");
const db = require("../config/db");

// Send Signup OTP
const sendSignupOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // Hash OTP
        const otpHash = await bcrypt.hash(otp, 10);

        // OTP expires after 5 minutes
        const expiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        // Remove previous signup OTP for this email
        await db.query(
            `DELETE FROM email_otps
             WHERE email = $1
             AND purpose = 'signup'`,
            [email]
        );

        // Save new OTP
        await db.query(
            `INSERT INTO email_otps
            (email, otp_hash, purpose, expires_at)
            VALUES ($1, $2, 'signup', $3)`,
            [
                email,
                otpHash,
                expiresAt
            ]
        );

        // Send OTP email
        await transporter.sendMail({
            from: `"KineWrite" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "KineWrite Email Verification",
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>KineWrite Email Verification</h2>

                    <p>
                        Your verification code is:
                    </p>

                    <h1 style="letter-spacing: 8px;">
                        ${otp}
                    </h1>

                    <p>
                        This code will expire in
                        <strong>5 minutes</strong>.
                    </p>

                    <p>
                        If you did not request this code,
                        you can ignore this email.
                    </p>
                </div>
            `
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully."
        });

    } catch (error) {

        console.error(
            "Send Signup OTP Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to send OTP."
        });
    }
};

// Verify Signup OTP
const verifySignupOtp = async (req, res) => {
    try {

        const { email, otp } = req.body;

        // Check required fields
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required."
            });
        }

        // Find latest signup OTP
        const { rows } = await db.query(
            `SELECT *
             FROM email_otps
             WHERE email = $1
             AND purpose = 'signup'
             ORDER BY created_at DESC
             LIMIT 1`,
            [email.trim()]
        );

        // OTP not found
        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found."
            });
        }

        const otpRecord = rows[0];

        // Check if OTP has expired
        if (new Date() > new Date(otpRecord.expires_at)) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired."
            });
        }

        // Compare entered OTP with hashed OTP
        const isMatch = await bcrypt.compare(
            otp.toString(),
            otpRecord.otp_hash
        );

        // Incorrect OTP
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }

        // Mark OTP as verified
        await db.query(
            `UPDATE email_otps
             SET verified_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [otpRecord.id]
        );

        return res.status(200).json({
            success: true,
            message: "Email verified successfully."
        });

    } catch (error) {

        console.error(
            "Verify Signup OTP Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to verify OTP."
        });
    }
};

module.exports = {
    sendSignupOtp,
    verifySignupOtp
};

