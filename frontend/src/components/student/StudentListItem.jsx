import StudentActions from "./StudentActions";

const StudentListItem = ({
    student,
    onEdit,
    onArchive,
}) => {

    const getAvatar = () => {
        if (
            student.student_gender?.toLowerCase() === "male"
        ) {
            return "👦";
        }
        return "👧";
    };

    const getAssessmentColor = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-700";
            case "Ongoing":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getClassificationColor = (classification) => {

        switch (classification) {
            case "Mild":
                return "bg-blue-100 text-blue-700";
            case "Moderate":
                return "bg-orange-100 text-orange-700";
            case "Severe":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (

        <div
            className="
                bg-white
                rounded-3xl
                shadow-lg
                hover:shadow-xl
                transition-all
                duration-300
                p-6
                flex
                flex-col
                lg:flex-row
                justify-between
                gap-6
            "
        >

            {/* Left */}

            <div className="flex gap-5">
                <div
                    className="
                        w-24
                        h-24
                        rounded-full
                        bg-orange-100
                        flex
                        items-center
                        justify-center
                        text-5xl
                        shrink-0
                    "
                >
                    {getAvatar()}
                </div>

                <div>
                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-slate-800
                        "
                    >
                        {student.student_fname}{" "}
                        {student.student_lname}
                    </h2>
                    <p className="text-slate-500 mt-1">
                        {student.student_code}
                    </p>
                    <p className="text-slate-500">
                        Grade {student.student_grade_level}
                    </p>
                </div>
            </div>

            {/* Middle */}

            <div
                className="
                    flex
                    flex-wrap
                    items-center
                    gap-4
                "
            >

                <span
                    className={`
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-semibold
                        ${getAssessmentColor(
                            student.student_assessment_status
                        )}
                    `}
                >
                    {student.student_assessment_status}
                </span>

                <span
                    className={`
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-semibold
                        ${getClassificationColor(
                            student.student_classification
                        )}
                    `}
                >
                    {student.student_classification}
                </span>

                <span
                    className="
                        bg-indigo-100
                        text-indigo-700
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-semibold
                    "
                >
                    Level {student.student_current_level}
                </span>
            </div>

            {/* Right */}

            <div
                className="
                    flex
                    flex-col
                    items-end
                    justify-between
                    gap-4
                "
            >
                <div
                    className="
                        text-sm
                        text-slate-400
                    "
                >
                    Last Activity
                    <br />
                    <span className="font-medium">
                        {
                            student.student_last_activity ??
                            "No Activity"
                        }
                    </span>
                </div>

                <StudentActions
                    student={student}
                    onEdit={onEdit}
                    onArchive={onArchive}
                />
            </div>
        </div>
    );
};

export default StudentListItem;