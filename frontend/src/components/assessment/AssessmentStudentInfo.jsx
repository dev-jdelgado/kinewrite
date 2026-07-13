import {
    UserRound,
    CalendarDays,
    GraduationCap,
    VenusAndMars,
    BadgeCheck,
    Hash,
} from "lucide-react";

import { useAssessment } from "../../contexts/AssessmentContext";

const AssessmentStudentInfo = () => {

    const { student } = useAssessment();
    const calculateAge = (birthday) => {

        if (!birthday) return "-";

        const today = new Date();
        const birthDate = new Date(birthday);

        let age =
            today.getFullYear() -
            birthDate.getFullYear();

        const monthDifference =
            today.getMonth() -
            birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (
                monthDifference === 0 &&
                today.getDate() < birthDate.getDate()
            )
        ) {
            age--;
        }
        return age;
    };

    if (!student) {
        return (
            <div
                className="
                    py-24
                    text-center
                    text-slate-500
                "
            >
                Loading student information...
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h2
                    className="
                        text-3xl
                        font-bold
                        text-slate-800
                    "
                >
                    Student Information
                </h2>

                <p
                    className="
                        mt-2
                        text-slate-500
                    "
                >
                    Please verify the student's information before beginning the assessment.
                </p>
            </div>

            {/* Student Card */}
            <div
                className="
                    bg-orange-50
                    border
                    border-orange-200
                    rounded-3xl
                    p-8
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        lg:flex-row
                        items-center
                        gap-8
                    "
                >
                    <div
                        className="
                            w-32
                            h-32
                            rounded-full
                            bg-white
                            shadow-md
                            flex
                            items-center
                            justify-center
                            text-orange-500
                        "
                    >
                        <UserRound size={70} />
                    </div>
                    <div className="flex-1">
                        <h3
                            className="
                                text-4xl
                                font-bold
                                text-slate-800
                            "
                        >
                            {student.student_fname} {student.student_lname}
                        </h3>
                        <div
                            className="
                                mt-3
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-white
                                px-4
                                py-2
                                text-slate-700
                                font-semibold
                                shadow
                            "
                        >
                            <Hash size={18} />
                            {student.student_code}
                        </div>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div
                className="
                    mt-8
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-6
                "
            >
                <InfoCard
                    icon={<CalendarDays size={24} />}
                    label="Age"
                    value={`${calculateAge(student.student_bday)} Years Old`}
                />
                <InfoCard
                    icon={<VenusAndMars size={24} />}
                    label="Gender"
                    value={student.student_gender}
                />
                <InfoCard
                    icon={<GraduationCap size={24} />}
                    label="Grade Level"
                    value={`Grade ${student.student_grade_level}`}
                />
                <InfoCard
                    icon={<BadgeCheck size={24} />}
                    label="Current Classification"
                    value={
                        student.student_classification ||
                        "Not Assessed"
                    }
                />
            </div>

            {/* Reminder */}
            <div
                className="
                    mt-10
                    rounded-2xl
                    border-l-4
                    border-orange-500
                    bg-orange-50
                    p-6
                "
            >
                <h4
                    className="
                        text-lg
                        font-bold
                        text-orange-700
                    "
                >
                    Before You Continue
                </h4>
                <p
                    className="
                        mt-2
                        text-slate-600
                        leading-relaxed
                    "
                >
                    Verify that the student's information is correct before
                    proceeding with the assessment. The assessment results
                    will determine the student's handwriting classification
                    and automatically generate the recommended therapy plan.
                </p>
            </div>
        </div>
    );
};

const InfoCard = ({
    icon,
    label,
    value,
}) => {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow-md
                p-6
                flex
                items-start
                gap-4
            "
        >
            <div
                className="
                    w-12
                    h-12
                    rounded-xl
                    bg-orange-100
                    text-orange-600
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                "
            >
                {icon}
            </div>

            <div>
                <p
                    className="
                        text-sm
                        text-slate-500
                    "
                >
                    {label}
                </p>

                <h4
                    className="
                        mt-1
                        text-xl
                        font-bold
                        text-slate-800
                    "
                >
                    {value}
                </h4>
            </div>
        </div>
    );
};

export default AssessmentStudentInfo;