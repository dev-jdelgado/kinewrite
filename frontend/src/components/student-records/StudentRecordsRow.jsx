import { Eye } from "lucide-react";

const StudentRecordsRow = ({
    student,
    onView,
}) => {

    const formatLastActivity = (date) => {
        if (!date) return "Never";
        return new Date(date).toLocaleDateString();
    };

    return (

        <tr
            className="
                border-b
                hover:bg-orange-50
                transition-colors
            "
        >

            <td className="px-6 py-5 font-medium text-slate-700">
                {student.student_code}
            </td>

            <td className="px-6 py-5">
                <div>
                    <p className="font-semibold text-slate-800">
                        {student.student_fname} {student.student_lname}
                    </p>

                    <p className="text-sm text-slate-500">
                        {student.student_gender}
                    </p>
                </div>
            </td>

            <td className="px-6 py-5">
                Grade {student.student_grade_level}
            </td>

            <td className="px-6 py-5">
                Level {student.student_current_level}
            </td>

            <td className="px-6 py-5">
                <span
                    className="
                        rounded-full
                        bg-orange-100
                        px-3
                        py-1
                        text-sm
                        font-medium
                        text-orange-700
                    "
                >
                    {student.student_classification}
                </span>
            </td>

            <td className="px-6 py-5">
                <span
                    className={`
                        rounded-full
                        px-3
                        py-1
                        text-sm
                        font-medium
                        ${
                            student.student_assessment_status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                        }
                    `}
                >
                    {student.student_assessment_status}
                </span>
            </td>
            <td className="px-6 py-5 text-slate-600">
                {formatLastActivity(student.student_last_activity)}
            </td>
            <td className="px-6 py-5 text-center">
                <button
                    onClick={() => onView(student)}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#9b4c00]
                        p-3
                        text-white
                        shadow-md
                        transition-all
                        hover:bg-[#7a3b00]
                    "
                >
                    <Eye size={20} />
                </button>
            </td>
        </tr>
    );
};

export default StudentRecordsRow;