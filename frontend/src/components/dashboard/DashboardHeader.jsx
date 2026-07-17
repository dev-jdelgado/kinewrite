import React from "react";
import { Settings, UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";

const DashboardHeader = () => {

    const navigate = useNavigate();

    return (
        <header
            className="
                bg-white
                dark:bg-blue-200
                shadow-md
                px-10
                py-6
                flex
                items-center
                justify-between
            "
        >
            <div className="flex items-center gap-6">
                {/* <div
                    className="
                        w-16
                        h-16
                        rounded-full
                        bg-orange-500
                        text-white
                        flex
                        items-center
                        justify-center
                    "
                >
                    <UserCircle2 size={42} />
                </div> */}

                <img
                    src={logo}
                    alt="KineWrite"
                    className="h-20 w-auto object-contain"
                />
            </div>

            <button
                onClick={() => navigate("/account-settings")}
                className="
                    w-20
                    h-20
                    rounded-full
                    bg-[#43a7f3]
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-lg
                    hover:scale-110
                    transition-all
                "
            >
                <Settings size={42} />
            </button>
        </header>
    );
};

export default DashboardHeader;