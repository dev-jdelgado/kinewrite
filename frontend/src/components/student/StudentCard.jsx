import React from "react";

const StudentCard = ({ student, onClick }) => {
    const isMale = student.student_gender === "Male";

    const getClassificationColor = (classification) => {
        switch (classification) {
            case "Severe":
                return `
                    bg-red-100 text-red-600
                    dark:bg-red-950/60 dark:text-red-400
                `;

            case "Moderate":
                return `
                    bg-orange-100 text-orange-600
                    dark:bg-orange-950/60 dark:text-orange-400
                `;

            case "Mild":
                return `
                    bg-yellow-100 text-yellow-700
                    dark:bg-yellow-950/60 dark:text-yellow-400
                `;

            case "Not Assessed":
            case "Pending":
            default:
                return `
                    bg-blue-100 text-blue-600
                    dark:bg-blue-950/60 dark:text-blue-400
                `;
        }
    };

    return (
        <button
            onClick={onClick}
            className="
                w-full
                bg-white
                dark:bg-slate-800
                rounded-3xl
                shadow-md
                dark:shadow-black/30
                hover:shadow-xl
                dark:hover:shadow-black/50
                hover:-translate-y-1
                transition-all
                duration-300
                p-6
                flex
                flex-col
                items-center
                text-center
            "
        >
            <div
                className="
                    w-24
                    h-24
                    rounded-full
                    bg-blue-100
                    dark:bg-blue-950/60
                    flex
                    items-center
                    justify-center
                    text-6xl
                "
            >
                {isMale ? "👦" : "👧"}
            </div>

            <h2 className="mt-5 font-bold text-xl text-slate-800 dark:text-white">
                {student.student_fname} {student.student_lname}
            </h2>

            <p className="text-slate-500 mt-1 dark:text-slate-300">
                Grade {student.student_grade_level}
            </p>

            <div
                className={`
                    mt-4
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    ${getClassificationColor(student.student_classification)}
                `}
            >
                {student.student_classification}
            </div>

            <div className="mt-5 text-center">
                <p className="text-sm text-gray-500 dark:text-slate-400">
                    Current Level
                </p>

                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    Level {student.student_current_level}
                </h3>
            </div>
        </button>
    );
};

export default StudentCard;