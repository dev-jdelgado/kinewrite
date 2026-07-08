import React from "react";
import BgLogin from '../assets/login/Loginbg.png'

const DashboardLayout = ({ children }) => {
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat" 
                    style={{backgroundImage: `url(${BgLogin})`}}
        >
            {children}
        </div>  
    );
};

export default DashboardLayout;