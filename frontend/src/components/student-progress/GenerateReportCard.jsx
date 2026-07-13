import {
    FileText,
    Download,
    Printer,
    CalendarDays,
} from "lucide-react";

const GenerateReportCard = ({
    student,
    onGeneratePDF,
    onPrint,
}) => {

    const generatedDate = new Date().toLocaleDateString();

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
                <FileText
                    size={28}
                    className="text-[#9b4c00]"
                />
                <div>
                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-slate-800
                        "
                    >
                        Student Progress Report
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Generate a printable therapy progress report for parents,
                        teachers, or documentation.
                    </p>
                </div>
            </div>

            <div
                className="
                    rounded-2xl
                    bg-orange-50
                    border
                    border-orange-200
                    p-6
                "
            >
                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-4
                        gap-6
                    "
                >
                    <div>
                        <p className="text-sm text-slate-500">
                            Student
                        </p>
                        <h3
                            className="
                                mt-2
                                text-lg
                                font-bold
                                text-slate-800
                            "
                        >
                            {student
                                ? `${student.student_fname} ${student.student_lname}`
                                : "-"}
                        </h3>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">
                            Student Code
                        </p>
                        <h3
                            className="
                                mt-2
                                text-lg
                                font-bold
                                text-slate-800
                            "
                        >
                            {student?.student_code || "-"}
                        </h3>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">
                            Current Level
                        </p>
                        <h3
                            className="
                                mt-2
                                text-lg
                                font-bold
                                text-slate-800
                            "
                        >
                            Level {student?.student_current_level || 1}
                        </h3>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">
                            Generated On
                        </p>
                        <div
                            className="
                                mt-2
                                flex
                                items-center
                                gap-2
                                font-semibold
                                text-slate-800
                            "
                        >
                            <CalendarDays size={18} />
                            {generatedDate}
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="
                    mt-8
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-6
                "
            >
                <button
                    onClick={onGeneratePDF}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-3
                        rounded-2xl
                        bg-[#9b4c00]
                        px-6
                        py-5
                        text-lg
                        font-semibold
                        text-white
                        shadow-lg
                        transition-all
                        hover:bg-[#7a3b00]
                        hover:scale-[1.02]
                    "
                >
                    <Download size={24} />
                    Generate PDF Report
                </button>

                <button
                    onClick={onPrint}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-3
                        rounded-2xl
                        border-2
                        border-[#9b4c00]
                        bg-white
                        px-6
                        py-5
                        text-lg
                        font-semibold
                        text-[#9b4c00]
                        transition-all
                        hover:bg-orange-50
                        hover:scale-[1.02]
                    "
                >
                    <Printer size={24} />
                    Print Report
                </button>
            </div>

            <div
                className="
                    mt-8
                    rounded-2xl
                    bg-slate-50
                    border
                    p-6
                "
            >
                <h3
                    className="
                        text-lg
                        font-bold
                        text-slate-800
                    "
                >
                    Report Contents
                </h3>
                <div
                    className="
                        mt-5
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-y-3
                        text-slate-600
                    "
                >
                    <p>✅ Student Profile</p>
                    <p>✅ Assessment Results</p>
                    <p>✅ Current Therapy Progress</p>
                    <p>✅ Exercise Statistics</p>
                    <p>✅ Exercise Session History</p>
                    <p>✅ Handwriting Progress Summary</p>
                    <p>✅ Therapist Notes</p>
                    <p>✅ KineWrite Report Information</p>
                </div>
            </div>
        </div>
    );
};

export default GenerateReportCard;