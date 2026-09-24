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
                border-slate-200
                dark:border-slate-700
                hover:bg-blue-50
                dark:hover:bg-slate-700/60
                transition-colors
            "
        >

            <td className="px-6 py-5 font-medium text-slate-700 dark:text-slate-200">
                {student.student_code}
            </td>

            <td className="px-6 py-5">
                <div>
                    <p className="font-semibold text-slate-800 dark:text-white">
                        {student.student_fname} {student.student_lname}
                    </p>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {student.student_gender}
                    </p>
                </div>
            </td>

            <td className="px-6 py-5 text-slate-700 dark:text-slate-200">
                Grade {student.student_grade_level}
            </td>

            <td className="px-6 py-5 text-slate-700 dark:text-slate-200">
                Level {student.student_current_level}
            </td>

            <td className="px-6 py-5 ">
                <span
                    className="
                        rounded-full
                        bg-orange-100
                        dark:bg-orange-950/50
                        px-3
                        py-1
                        text-sm
                        font-medium
                        text-orange-700
                        dark:text-orange-400
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
                                ? `
                                    bg-green-100
                                    dark:bg-green-950/50
                                    text-green-700
                                    dark:text-green-400
                                `
                                : `
                                    bg-yellow-100
                                    dark:bg-yellow-950/50
                                    text-yellow-700
                                    dark:text-yellow-400
                                `
                        }
                    `}
                >
                    {student.student_assessment_status}
                </span>
            </td>
            <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
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
                        bg-blue-400
                        dark:bg-blue-600
                        p-3
                        text-white
                        shadow-md
                        transition-all
                        hover:bg-blue-500
                        dark:hover:bg-blue-500
                    "
                >
                    <Eye size={20} />
                </button>
            </td>
        </tr>
    );
};

export default StudentRecordsRow;