import {
    ClipboardCheck,
    CalendarDays,
    Activity,
    FileText,
} from "lucide-react";

const AssessmentOverview = ({
    student,
}) => {

    if (!student) return null;

    return (

        <div
            className="
                bg-white
                dark:bg-slate-800
                rounded-3xl
                shadow-lg
                dark:shadow-black/30
                p-8
                mb-8
                transition-colors
                duration-300
            "
        >
            <div
                className="
                    flex
                    items-center
                    gap-3
                    mb-8
                "
            >
                <ClipboardCheck
                    size={28}
                    className="text-[#9b4c00] dark:text-orange-400"
                />
                <h2
                    className="
                        text-2xl
                        font-bold
                        text-slate-800
                        dark:text-white
                    "
                >
                    Latest Assessment
                </h2>
            </div>

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-4
                    gap-6
                "
            >
                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        dark:border-slate-600
                        p-6
                    "
                >
                    <div className="flex items-center gap-3">
                        <Activity
                            className="text-orange-500 dark:text-orange-400"
                        />
                        <p className="font-semibold text-slate-600 dark:text-slate-300">
                            Classification
                        </p>
                    </div>

                    <h3
                        className="
                            mt-5
                            text-2xl
                            font-bold
                            text-slate-800
                            dark:text-white
                        "
                    >
                        {student.student_classification || "Pending"}
                    </h3>
                </div>

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        dark:border-slate-600
                        p-6
                    "
                >
                    <div className="flex items-center gap-3">
                        <ClipboardCheck
                            className="text-green-600 dark:text-green-400"
                        />
                        <p className="font-semibold text-slate-600 dark:text-green-400">
                            Assessment Status
                        </p>
                    </div>
                    <h3
                        className="
                            mt-5
                            text-2xl
                            font-bold
                            text-slate-800
                            dark:text-white
                        "
                    >
                        {student.student_assessment_status || "Pending"}
                    </h3>
                </div>

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        dark:border-slate-600
                        p-6
                    "
                >
                    <div className="flex items-center gap-3">
                        <FileText
                            className="text-blue-600 dark:text-blue-400"
                        />
                        <p className="font-semibold text-slate-600 dark:text-slate-300">
                            Recommendation
                        </p>
                    </div>
                    <h3
                        className="
                            mt-5
                            text-2xl
                            font-bold
                            text-slate-800
                            dark:text-white
                        "
                    >
                        Level {student.student_current_level || 1}
                    </h3>
                </div>

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        dark:border-slate-600
                        p-6
                    "
                >

                    <div className="flex items-center gap-3">
                        <CalendarDays
                            className="text-purple-600 dark:text-purple-400"
                        />
                        <p className="font-semibold text-slate-600 dark:text-slate-300">
                            Assessment Date
                        </p>
                    </div>

                    <h3
                        className="
                            mt-5
                            text-xl
                            font-bold
                            text-slate-800
                            dark:text-white
                        "
                    >
                        {student.student_last_activity
                            ? new Date(
                                  student.student_last_activity
                              ).toLocaleDateString()
                            : "Not Available"}
                    </h3>
                </div>
            </div>

            <div
                className="
                    mt-8
                    rounded-2xl
                    bg-orange-50
                    dark:bg-orange-950/40
                    border
                    border-orange-200
                    dark:border-orange-900
                    p-6
                "
            >

                <h3
                    className="
                        font-bold
                        text-lg
                        text-[#9b4c00]
                        dark:text-orange-400
                    "
                >
                    Therapist Notes
                </h3>

                <p
                    className="
                        mt-3
                        text-slate-600
                        dark:text-slate-300
                        leading-relaxed
                    "
                >
                    {student.student_notes
                        ? student.student_notes
                        : "No therapist notes have been recorded for this student."}
                </p>
            </div>
        </div>
    );
};

export default AssessmentOverview;