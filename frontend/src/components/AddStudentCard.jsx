import React from "react";

const AddStudentCard = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="
                border-2
                border-dashed
                border-blue-300
                rounded-3xl
                bg-white
                hover:bg-blue-50
                transition-all
                duration-300
                p-6
                min-h-85
                flex
                flex-col
                items-center
                justify-center
                text-blue-600
            "
        >
            <div className="text-7xl font-light">
                +
            </div>

            <h2 className="mt-5 text-xl font-bold">
                Add Student
            </h2>

            <p className="text-gray-500 mt-2 text-center">
                Create a new student profile.
            </p>
        </button>
    );
};

export default AddStudentCard;