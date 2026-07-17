import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";


import {
    FaUserCircle,
    FaCamera,
    FaEdit,
    FaSave,
    FaTimes,
} from "react-icons/fa";

export default function ProfileSection() {

    const [admin, setAdmin] = useState(null);


    /* for Upload Image */
    const [image, setImage] = useState(null);        // Preview
    const [imageFile, setImageFile] = useState(null); // Actual File


    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;
        // Create preview
        setImage(URL.createObjectURL(file));
        // Save actual file
        setImageFile(file);
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

            const data = new FormData();

            data.append("id", admin.id);
            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("school", formData.school);
            data.append("phone", formData.phone);

            // Send image if selected
            if (imageFile) {
                data.append("image", imageFile);
            }

            const response = await axios.put(
                "http://localhost:5000/api/auth/profile",
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {

                localStorage.setItem(
                    "admin",
                    JSON.stringify({
                        ...admin,
                        name: formData.name,
                        email: formData.email,
                        school: formData.school,
                        phone: formData.phone,
                        profile_image:
                            response.data.profile_image ??
                            admin.profile_image
                    })
                );

                setIsEditing(false);

                toast.success("Profile updated successfully!");
            }

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to update profile."
            );
        }
    };

    return (

        <div>

            {/* LEFT SIDE */}
            <div className="border-r border-gray-300 pr-8">

                <h2 className="text-3xl font-bold mb-6 inline-block px-2">
                    Personal Information
                </h2>
                {/* !!!REMOVED CONTENT for Profile Image and Name!!! */}
                <div className="flex items-center gap-4 mb-6">
                    <div
                        className="relative w-28 h-28 cursor-pointer"
                        onClick={() => fileInputRef.current.click()}
                    >
                        {image || admin?.profile_image ? (
                            <img
                                src={
                                    image
                                        ? image
                                        : `http://localhost:5000/uploads/${admin.profile_image}`
                                }
                                alt="Profile"
                                className="w-28 h-28 rounded-full object-cover border-4 border-blue-400"
                            />
                        ) : (
                            <FaUserCircle className="w-28 h-28 text-gray-400" />
                        )}

                        <div className="absolute bottom-0 right-0 bg-blue-400 p-2 rounded-full text-white">
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
                </div>

                {/* Name */}
                <div className="mb-4">
                    <label className="font-semibold">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className="w-full mt-1 rounded-xl border px-4 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                        className="w-full mt-1 rounded-xl border px-4 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                        className="w-full mt-1 rounded-xl border px-4 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                        className="w-full mt-1 rounded-xl border px-4 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mt-4">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
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


        </div>

    );
};
