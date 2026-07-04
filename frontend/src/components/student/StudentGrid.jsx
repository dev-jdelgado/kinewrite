import React from "react";

const StudentGrid = ({ children }) => {
    return (
        <div
            className="
                grid
                gap-8
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
            "
        >
            {children}
        </div>
    );
};

export default StudentGrid;