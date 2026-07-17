
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import axios from "axios";



export default function ChangePassword() {

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

                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter current password"
                            className="w-full border rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            New Password
                        </label>

                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter new password"
                            className="w-full border rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Confirm new password"
                            className="w-full border rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
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

