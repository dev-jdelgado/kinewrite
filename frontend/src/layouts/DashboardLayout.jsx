import React from "react";

const DashboardLayout = ({ children }) => {
    return (
        <div
            className="
                min-h-screen
                bg-[#FDE6C7]
                bg-cover
                bg-center
            "
        >
            {children}
        </div>
    );
};

export default DashboardLayout;