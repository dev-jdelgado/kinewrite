import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthService from "../services/AuthService";

import {
    FaSchool,
    FaUser,
    FaEnvelope,
    FaLock,
    FaKey,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";


const Signup = () => {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        schoolName: "",
        schoolCode: "",
        adminName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSendOtp = async () => {
        if (!formData.email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }

        setOtpLoading(true);

        try {
            const response = await AuthService.sendSignupOtp(
                formData.email.trim()
            );

            if (response.data.success) {
                setOtpSent(true);
                setOtpVerified(false);
                setOtp("");

                toast.success("OTP sent to your email.");
            } else {
                toast.error(
                    response.data.message || "Failed to send OTP."
                );
            }

        } catch (error) {
            console.error("Send OTP Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to send OTP."
            );
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            toast.error("Please enter the OTP.");
            return;
        }

        setOtpLoading(true);

        try {
            const response = await AuthService.verifySignupOtp(
                formData.email.trim(),
                otp.trim()
            );

            if (response.data.success) {
                setOtpVerified(true);

                toast.success("Email verified successfully.");
            } else {
                setOtpVerified(false);

                toast.error(
                    response.data.message || "Invalid OTP."
                );
            }

        } catch (error) {
            console.error("Verify OTP Error:", error);

            setOtpVerified(false);

            toast.error(
                error.response?.data?.message ||
                "Unable to verify OTP."
            );
        } finally {
            setOtpLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        const commonPasswords = [
            "password",
            "password123",
            "admin",
            "admin123",
            "pass123",
            "qwerty",
            "123456",
            "12345678",
            "123456789",
            "welcome"
        ];

        if (commonPasswords.includes(password.toLowerCase())) {
            return {
                score: 0,
                label: "Poor",
                message: "This password is too common."
            };
        }

        let score = 0;

        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) {
            return {
                score,
                label: "Poor",
                message: "Weak password."
            };
        }

        if (score <= 4) {
            return {
                score,
                label: "Moderate",
                message: "Fair password."
            };
        }

        return {
            score,
            label: "Strong",
            message: "Strong password."
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // =========================
        // BASIC VALIDATION
        // =========================

        if (
            !formData.schoolName.trim() ||
            !formData.schoolCode.trim() ||
            !formData.adminName.trim() ||
            !formData.username.trim() ||
            !formData.email.trim() ||
            !formData.password.trim() ||
            !formData.confirmPassword.trim()
        ) {
            toast.error("Please complete all fields.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        // =========================
        // OTP VALIDATION
        // =========================

        if (!otpVerified) {
            toast.error("Please verify your email first.");
            return;
        }

        // =========================
        // PASSWORD VALIDATION
        // =========================

        const passwordStrength = getPasswordStrength(
            formData.password
        );

        if (passwordStrength.label !== "Strong") {
            toast.error(
                passwordStrength.label === "Poor"
                    ? passwordStrength.message
                    : "Password must contain at least 8 characters, uppercase, lowercase, number, and special character."
            );
            return;
        }

        setLoading(true);

        try {

            // =========================
            // CREATE ACCOUNT
            // =========================

            const response = await AuthService.signup(formData);

            if (response.data.success) {

                toast.success(
                    "School account created successfully!"
                );

                // Go back to Login
                navigate("/");

            } else {

                toast.error(
                    response.data.message || "Signup failed."
                );

            }

        } catch (error) {

            console.error("Signup Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to create school account."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <AuthLayout>

            <div className="bg-white rounded-3xl shadow-xl w-full relative px-6 sm:px-12 py-10 max-w-2xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-slate-800">
                        Create School Account
                    </h1>

                    <p className="text-sm text-slate-500 mt-2">
                        Register your school and administrator account
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* =========================
                        SCHOOL INFORMATION
                    ========================= */}

                    <div>

                        <h2 className="text-lg font-semibold text-slate-700 mb-4">
                            School Information
                        </h2>

                        <div className="space-y-4">

                            <Input
                                label="School Name"
                                name="schoolName"
                                value={formData.schoolName}
                                onChange={handleChange}
                                placeholder="Enter school name"
                                icon={<FaSchool />}
                            />

                            <Input
                                label="School Code"
                                name="schoolCode"
                                value={formData.schoolCode}
                                onChange={handleChange}
                                placeholder="Enter unique school code"
                                icon={<FaKey />}
                            />

                        </div>

                    </div>


                    {/* =========================
                        ADMINISTRATOR INFORMATION
                    ========================= */}

                    <div>

                        <h2 className="text-lg font-semibold text-slate-700 mb-4">
                            Administrator Information
                        </h2>

                        <div className="space-y-4">

                            <Input
                                label="Full Name"
                                name="adminName"
                                value={formData.adminName}
                                onChange={handleChange}
                                placeholder="Enter administrator name"
                                icon={<FaUser />}
                            />

                            <Input
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                icon={<FaUser />}
                            />

                            <div>
                                <div className="flex gap-2 items-end">

                                    <div className="flex-1">
                                        <Input
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setOtpSent(false);
                                                setOtpVerified(false);
                                            }}
                                            placeholder="Enter email address"
                                            icon={<FaEnvelope />}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={otpLoading || otpVerified}
                                        className="h-12 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {otpLoading
                                            ? "Sending..."
                                            : otpVerified
                                                ? "Verified"
                                                : otpSent
                                                    ? "Resend OTP"
                                                    : "Send OTP"}
                                    </button>

                                </div>

                                {otpSent && !otpVerified && (
                                    <div className="mt-3 flex gap-2">

                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter 6-digit OTP"
                                            maxLength={6}
                                            className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                        <button
                                            type="button"
                                            onClick={handleVerifyOtp}
                                            disabled={otpLoading}
                                            className="px-4 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {otpLoading ? "Checking..." : "Verify"}
                                        </button>

                                    </div>
                                )}

                                {otpVerified && (
                                    <p className="mt-2 text-sm text-green-600 font-medium">
                                        ✓ Email verified successfully
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block font-semibold mb-2">
                                    Password
                                </label>

                                <div className="relative">
                                    <Input
                                        label=""
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                        icon={<FaLock />}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <ul className="mt-3 text-sm space-y-1">
                                <li
                                    className={
                                        formData.password.length >= 8
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }
                                >
                                    ✓ At least 8 characters
                                </li>

                                <li
                                    className={
                                        /[A-Z]/.test(formData.password)
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }
                                >
                                    ✓ One uppercase letter
                                </li>

                                <li
                                    className={
                                        /[a-z]/.test(formData.password)
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }
                                >
                                    ✓ One lowercase letter
                                </li>

                                <li
                                    className={
                                        /\d/.test(formData.password)
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }
                                >
                                    ✓ One number
                                </li>

                                <li
                                    className={
                                        /[^A-Za-z0-9]/.test(formData.password)
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }
                                >
                                    ✓ One special character
                                </li>
                            </ul>

                            <div>
                                <label className="block font-semibold mb-2">
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <Input
                                        label=""
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm password"
                                        icon={<FaLock />}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>


                    {/* =========================
                        SIGNUP BUTTON
                    ========================= */}

                    <Button
                        type="submit"
                        fullWidth
                        loading={loading}
                    >
                        Create School Account
                    </Button>


                    {/* =========================
                        BACK TO LOGIN
                    ========================= */}

                    <div className="text-center pt-2">

                        <p className="text-sm text-slate-500">

                            Already have an account?{" "}

                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                            >
                                Login
                            </button>

                        </p>

                    </div>

                </form>

            </div>

        </AuthLayout>
    );
};

export default Signup;