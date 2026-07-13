import {
    ClipboardPen,
    UserRound,
    BadgeCheck,
} from "lucide-react";

import { useAssessment } from "../../contexts/AssessmentContext";

const AssessmentHeader = () => {

    const {
        student,
        currentStep,
        totalSteps,
    } = useAssessment();

    const progress =
        Math.round((currentStep / totalSteps) * 100);

    return (

        <div
            className="
                bg-white
                rounded-3xl
                shadow-lg
                overflow-hidden
            "
        >

            {/* Top Banner */}
            <div
                className="
                    bg-gradient-to-r
                    from-[#9b4c00]
                    to-[#c96d15]
                    px-10
                    py-8
                    text-white
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                        gap-8
                    "
                >
                    <div>
                        <div
                            className="
                                inline-flex
                                items-center
                                gap-3
                                bg-white/20
                                rounded-full
                                px-4
                                py-2
                                mb-5
                            "
                        >
                            <ClipboardPen size={20} />
                            <span
                                className="
                                    font-semibold
                                "
                            >
                                Pre-Assessment Workflow
                            </span>
                        </div>
                        <h1
                            className="
                                text-4xl
                                font-bold
                            "
                        >
                            Handwriting Assessment
                        </h1>
                        <p
                            className="
                                mt-3
                                text-orange-100
                                max-w-3xl
                                leading-relaxed
                            "
                        >
                            Complete the handwriting assessment to
                            automatically determine the student's
                            dysgraphia severity and generate an
                            individualized handwriting therapy plan.
                        </p>
                    </div>

                    {/* Student */}
                    <div
                        className="
                            bg-white/15
                            rounded-3xl
                            px-8
                            py-6
                            backdrop-blur
                            min-w-[320px]
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-5
                            "
                        >

                            <div
                                className="
                                    w-20
                                    h-20
                                    rounded-full
                                    bg-white
                                    text-[#9b4c00]
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                <UserRound size={42} />

                            </div>

                            <div>

                                <p
                                    className="
                                        text-orange-100
                                        text-sm
                                    "
                                >
                                    Selected Student
                                </p>

                                <h3
                                    className="
                                        text-2xl
                                        font-bold
                                    "
                                >
                                    {

                                        student

                                            ?

                                            `${student.student_fname} ${student.student_lname}`

                                            :

                                            "Loading..."

                                    }

                                </h3>

                                <div
                                    className="
                                        mt-2
                                        inline-flex
                                        items-center
                                        gap-2
                                        bg-white/20
                                        rounded-full
                                        px-3
                                        py-1
                                        text-sm
                                    "
                                >

                                    <BadgeCheck size={16} />

                                    {

                                        student?.student_code ||
                                        "--"

                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress */}
            <div className="px-10 py-8">
                <div
                    className="
                        flex
                        justify-between
                        items-center
                        mb-3
                    "
                >

                    <h3
                        className="
                            text-xl
                            font-bold
                            text-slate-800
                        "
                    >
                        Assessment Progress
                    </h3>

                    <span
                        className="
                            font-semibold
                            text-[#9b4c00]
                        "
                    >
                        Step {currentStep} of {totalSteps}
                    </span>
                </div>

                <div
                    className="
                        w-full
                        h-4
                        rounded-full
                        bg-orange-100
                        overflow-hidden
                    "
                >
                    <div
                        className="
                            h-full
                            bg-gradient-to-r
                            from-[#9b4c00]
                            to-orange-500
                            transition-all
                            duration-500
                        "
                        style={{
                            width: `${progress}%`,
                        }}
                    />

                </div>

                <p
                    className="
                        mt-3
                        text-slate-500
                    "
                >
                    The assessment consists of six guided steps.
                    After the student completes the handwriting
                    activity, KineWrite will automatically analyze
                    the writing sample and recommend the appropriate
                    therapy level.
                </p>
            </div>
        </div>
    );
};

export default AssessmentHeader;