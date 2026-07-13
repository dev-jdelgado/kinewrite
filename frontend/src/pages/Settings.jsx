import DashboardLayout from "../layouts/DashboardLayout";

import PageContainer from "../components/common/PageContainer";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import BackButton from "../components/common/BackButton";
import logo from "../assets/logo.png";

import { FaUserCircle, FaSave, FaSignOutAlt, FaCamera, FaEdit, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Settings() {
    const [emailNotif, setEmailNotif] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [darkMode, setDarkMode] = useState(false);



    const [admin, setAdmin] = useState(null);
    const navigate = useNavigate();

    /* For Logout */
    const handleLogout = () => {
        // Remove saved login information
        localStorage.removeItem("token");
        localStorage.removeItem("admin");

        // Redirect to Login page
        navigate("/");
        // or navigate("/login"); depending on your route
    };



    /* for Upload Image */
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    /* This is for Fetching admin Data */
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("admin"));

        if (data) {
            setAdmin(data);
        }
    }, []);

    /* This is for Edit Function */
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: admin?.name || "",
        email: admin?.email || "",
        school: admin?.school || "",
        phone: admin?.phone || ""
    });
    useEffect(() => {
        if (admin) {
            setFormData({
                name: admin.name || "",
                email: admin.email || "",
                school: admin.school || "",
                phone: admin.phone || ""
            });
        }
    }, [admin]);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        console.log("handleSave called");
        try {
            const admin = JSON.parse(localStorage.getItem("admin"));

            const response = await axios.put(
                "http://localhost:5000/api/auth/profile",
                {
                    id: admin.id,
                    name: formData.name,
                    email: formData.email,
                    school: formData.school,
                    phone: formData.phone,
                }
            );

            if (response.data.success) {

                // Update localStorage
                localStorage.setItem(
                    "admin",
                    JSON.stringify({
                        ...admin,
                        name: formData.name,
                        email: formData.email,
                        school: formData.school,
                        phone: formData.phone,
                    })
                );

                setIsEditing(false);

                alert("Profile updated successfully!");
            }

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message || "Failed to update profile."
            );
        }
    };

    return (

        <DashboardLayout>
            <PageContainer>
                {/* Back */}
                <div className="absolute top-8 left-8 z-40">
                    <BackButton />
                </div>
                {/* Logo */}
                <div className="absolute top-5 right-10 z-20">
                    <img
                        src={logo}
                        alt="KineWrite"
                        className="md:w-45 w-32"
                    />
                </div>

                <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8 mt-20">
                    <div className="grid md:grid-cols-2 gap-10">

                        {/* LEFT SIDE */}
                        <div className="border-r border-gray-300 pr-8">

                            <h2 className="text-3xl font-bold mb-6 inline-block px-2">
                                Personal Information
                            </h2>
                            {/* !!!REMOVED CONTENT for Profile Image and Name!!! */}
                            {/* <div className="flex items-center gap-4 mb-6">
                                <div
                                    className="relative w-28 h-28 cursor-pointer"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {image ? (
                                        <img
                                            src={image}
                                            alt="Profile"
                                            className="w-28 h-28 rounded-full object-cover border-4 border-orange-500"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-28 h-28 text-gray-400" />
                                    )}

                                    <div className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full text-white">
                                        <FaCamera />
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-3xl font-bold">
                                        {admin?.name}
                                    </h3>

                                    <p className="text-gray-600 font-semibold">
                                        Admin
                                    </p>
                                </div>
                            </div> */}

                            {/* Name */}
                            <div className="mb-4">
                                <label className="font-semibold">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    readOnly={!isEditing}
                                    className="w-full mt-1 rounded-xl border px-4 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />

                            </div>

                            {/* Email */}
                            <div className="mb-4">
                                <label className="font-semibold">Email</label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    readOnly={!isEditing}
                                    className="w-full mt-1 rounded-xl border px-4 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>

                            {/* School */}
                            <div className="mb-4">
                                <label className="font-semibold">School</label>

                                <input
                                    type="text"
                                    name="school"
                                    value={formData.school}
                                    onChange={handleChange}
                                    readOnly={!isEditing}
                                    className="w-full mt-1 rounded-xl border px-4 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="font-semibold">Phone</label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    readOnly={!isEditing}
                                    className="w-full mt-1 rounded-xl border px-4 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>
                            <div className="mt-4">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <FaEdit />
                                    Edit
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                    >
                                        <FaSave />
                                        Save
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsEditing(false);

                                            setFormData({
                                                name: admin.name,
                                                email: admin.email,
                                                school: admin.school,
                                                phone: admin.phone
                                            });
                                        }}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                    >
                                        <FaTimes />
                                        Cancel
                                    </button>
                                </div>
                            )}
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div>

                            <h2 className="text-3xl font-bold mb-10">
                                Preference
                            </h2>

                            {/* Email Notification */}
                            <PreferenceCard
                                title="Email Notification"
                                description="Receive updates about student progress"
                                checked={emailNotif}
                                onChange={() => setEmailNotif(!emailNotif)}
                            />

                            {/* Auto Save */}
                            <PreferenceCard
                                title="Auto - Save"
                                description="Automatically save exercise progress"
                                checked={autoSave}
                                onChange={() => setAutoSave(!autoSave)}
                            />

                            {/* Dark Mode */}
                            <PreferenceCard
                                title="Dark Mode"
                                description="Enable dark theme interface"
                                checked={darkMode}
                                onChange={() => setDarkMode(!darkMode)}
                            />

                            <div className="mt-10 flex flex-col items-center gap-4">

                                <button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-3 rounded-xl shadow-lg flex items-center gap-3 font-bold text-lg">
                                    <FaSave />
                                    Save Changes
                                </button>

                                <button onClick={handleLogout} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3 rounded-xl shadow-lg flex items-center gap-3 font-bold text-lg">
                                    <FaSignOutAlt />
                                    Logout
                                </button>

                            </div>

                        </div>

                    </div>
                </div>

            </PageContainer>
        </DashboardLayout>
    );
};

function PreferenceCard({
    title,
    description,
    checked,
    onChange,
}) {
    return (
        <div className="border rounded-xl shadow-md p-4 mb-5 flex justify-between items-center">

            <div>
                <h3 className="font-bold text-xl">
                    {title}
                </h3>

                <p className="text-gray-500 text-sm">
                    {description}
                </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">

                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="sr-only peer"
                />

                <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:bg-orange-500 transition"></div>

                <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition peer-checked:translate-x-6"></div>

            </label>

        </div>
    );
}
