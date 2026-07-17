import React from "react";
import BgLogin from '../assets/login/Loginbg.png'
import BgLoginDark from "../assets/login/Darkmodemoon.png";
import { useTheme } from "../contexts/ThemeContext";
import BlueLogin from "../assets/login/Lightbg.png";

const DashboardLayout = ({ children }) => {
    const { darkMode } = useTheme();
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-500"
                    style={{
                        backgroundImage: `url(${darkMode ? BgLoginDark : BlueLogin})`,
                    }}
        >
            {children}
        </div>  
    );
};

export default DashboardLayout;