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
                rounded-3xl
                shadow-lg
                p-8
                mb-8
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
                    className="text-[#9b4c00]"
                />
                <h2
                    className="
                        text-2xl
                        font-bold
                        text-slate-800
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
                        p-6
                    "
                >
                    <div className="flex items-center gap-3">
                        <Activity
                            className="text-orange-500"
                        />
                        <p className="font-semibold text-slate-600">
                            Classification
                        </p>
                    </div>

                    <h3
                        className="
                            mt-5
                            text-2xl
                            font-bold
                            text-slate-800
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
                        p-6
                    "
                >
                    <div className="flex items-center gap-3">
                        <ClipboardCheck
                            className="text-green-600"
                        />
                        <p className="font-semibold text-slate-600">
                            Assessment Status
                        </p>
                    </div>
                    <h3
                        className="
                            mt-5
                            text-2xl
                            font-bold
                            text-slate-800
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
                        p-6
                    "
                >
                    <div className="flex items-center gap-3">
                        <FileText
                            className="text-blue-600"
                        />
                        <p className="font-semibold text-slate-600">
                            Recommendation
                        </p>
                    </div>
                    <h3
                        className="
                            mt-5
                            text-2xl
                            font-bold
                            text-slate-800
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
                        p-6
                    "
                >

                    <div className="flex items-center gap-3">
                        <CalendarDays
                            className="text-purple-600"
                        />
                        <p className="font-semibold text-slate-600">
                            Assessment Date
                        </p>
                    </div>

                    <h3
                        className="
                            mt-5
                            text-xl
                            font-bold
                            text-slate-800
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
                    border
                    border-orange-200
                    p-6
                "
            >

                <h3
                    className="
                        font-bold
                        text-lg
                        text-[#9b4c00]
                    "
                >
                    Therapist Notes
                </h3>

                <p
                    className="
                        mt-3
                        text-slate-600
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