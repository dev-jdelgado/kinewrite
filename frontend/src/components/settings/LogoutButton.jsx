import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function LogoutButton() {

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

    return (

        <>
            <div className="mt-10 flex flex-col items-center gap-4">
                <button onClick={handleLogout} className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-3 rounded-xl shadow-lg flex items-center gap-3 font-bold text-lg">
                    <FaSignOutAlt />
                    Logout
                </button>

            </div>
        </>
    );
};

