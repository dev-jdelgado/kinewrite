
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function ChangePassword() {

    /* Hide and Unhide button */
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });


    /*  For change Password */
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangePassword = async () => {

        if (passwordStrength.label === "Poor") {
            return toast.error(
                "Please choose a stronger password."
            );
        }

        if (
            passwordData.newPassword !== passwordData.confirmPassword
        ) {
            return toast.error("Passwords do not match.");
        }

        try {

            const admin = JSON.parse(localStorage.getItem("admin"));

            const response = await axios.put(
                "http://localhost:5000/api/auth/change-password",
                {
                    id: admin.id,
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                }
            );

            toast.success(response.data.message);

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to change password."
            );

        }

    };

    /* Strong password implementation */
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
            "welcome",
        ];

        if (commonPasswords.includes(password.toLowerCase())) {
            return {
                score: 0,
                label: "Poor",
                color: "bg-red-500",
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
                color: "bg-red-500",
                message: "Weak password."
            };
        }

        if (score <= 4) {
            return {
                score,
                label: "Moderate",
                color: "bg-yellow-500",
                message: "Fair password."
            };
        }

        return {
            score,
            label: "Strong",
            color: "bg-green-500",
            message: "Strong password."
        };
    };
    const passwordStrength = getPasswordStrength(passwordData.newPassword);

    return (
        <>

            {/* Changing of Password */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-5">
                    Change Password
                </h2>

                <div className="space-y-4">

                    <div>
                        <label className="block font-semibold mb-2">
                            Current Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword.current ? "text" : "password"}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter current password"
                                className="w-full border rounded-xl px-4 py-3 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword({
                                        ...showPassword,
                                        current: !showPassword.current,
                                    })
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
                            >
                                {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>


                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            New Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword.new ? "text" : "password"}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter new password"
                                className="w-full border rounded-xl px-4 py-3 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword({
                                        ...showPassword,
                                        new: !showPassword.new,
                                    })
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
                            >
                                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                    </div>
                    {passwordData.newPassword && (
                        <div className="mt-2">

                            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                    style={{
                                        width:
                                            passwordStrength.label === "Poor"
                                                ? "33%"
                                                : passwordStrength.label === "Moderate"
                                                    ? "66%"
                                                    : "100%"
                                    }}
                                />
                            </div>

                            <p
                                className={`mt-1 text-sm font-semibold ${passwordStrength.label === "Poor"
                                    ? "text-red-600"
                                    : passwordStrength.label === "Moderate"
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                    }`}
                            >
                                {passwordStrength.label} • {passwordStrength.message}
                            </p>

                        </div>
                    )}
                    <ul className="mt-3 text-sm space-y-1">

                        <li className={passwordData.newPassword.length >= 8 ? "text-green-600" : "text-gray-400"}>
                            ✓ At least 8 characters
                        </li>

                        <li className={/[A-Z]/.test(passwordData.newPassword) ? "text-green-600" : "text-gray-400"}>
                            ✓ One uppercase letter
                        </li>

                        <li className={/[a-z]/.test(passwordData.newPassword) ? "text-green-600" : "text-gray-400"}>
                            ✓ One lowercase letter
                        </li>

                        <li className={/\d/.test(passwordData.newPassword) ? "text-green-600" : "text-gray-400"}>
                            ✓ One number
                        </li>

                        <li className={/[^A-Za-z0-9]/.test(passwordData.newPassword) ? "text-green-600" : "text-gray-400"}>
                            ✓ One special character
                        </li>

                    </ul>
                    <div>
                        <label className="block font-semibold mb-2">
                            Confirm Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword.confirm ? "text" : "password"}
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="Confirm new password"
                                className="w-full border rounded-xl px-4 py-3 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword({
                                        ...showPassword,
                                        confirm: !showPassword.confirm,
                                    })
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
                            >
                                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleChangePassword}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg transition"
                    >
                        Change Password
                    </button>

                </div>
            </div>
        </>
    );
};

