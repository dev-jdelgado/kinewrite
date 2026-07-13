import { UserRound, GraduationCap, CalendarDays, BadgeCheck } from "lucide-react";

const StudentProfileHeader = ({
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
            <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex gap-6">
                    <div
                        className="
                            w-28
                            h-28
                            rounded-full
                            bg-orange-100
                            flex
                            items-center
                            justify-center
                            text-6xl
                            shrink-0
                        "
                    >
                        {
                            student.student_gender === "Female"
                                ? "👧"
                                : "👦"
                        }
                    </div>

                    <div>
                        <h1
                            className="
                                text-4xl
                                font-bold
                                text-slate-800
                            "
                        >
                            {student.student_fname} {student.student_lname}
                        </h1>

                        <p
                            className="
                                mt-2
                                text-slate-500
                            "
                        >
                            {student.student_code}
                        </p>

                        <div
                            className="
                                flex
                                flex-wrap
                                gap-6
                                mt-6
                                text-slate-600
                            "
                        >
                            <div className="flex items-center gap-2">
                                <UserRound size={18} />
                                {student.student_gender}
                            </div>

                            <div className="flex items-center gap-2">
                                <GraduationCap size={18} />
                                Grade {student.student_grade_level}
                            </div>

                            <div className="flex items-center gap-2">
                                <CalendarDays size={18} />
                                {student.student_bday}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="
                        flex
                        items-center
                    "
                >
                    <div
                        className="
                            rounded-2xl
                            bg-green-50
                            px-6
                            py-5
                            border
                            border-green-200
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <BadgeCheck
                                className="text-green-600"
                            />
                            <span
                                className="
                                    font-semibold
                                    text-green-700
                                "
                            >
                                {student.student_assessment_status}
                            </span>
                        </div>
                        <p
                            className="
                                mt-3
                                text-sm
                                text-green-600
                            "
                        >
                            Assessment Status
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfileHeader;