import {
    ClipboardList,
    RotateCcw,
    CheckCircle2,
} from "lucide-react";

import { useAssessment } from "../../contexts/AssessmentContext";

const AssessmentType = () => {

    const {
        assessmentType,
        setAssessmentType,
    } = useAssessment();

    const options = [
        {
            value: "Pre-Test",
            title: "Pre-Test Assessment",
            icon: ClipboardList,
            color: "orange",
            description:
                "Conduct the student's initial handwriting assessment. The results will determine the student's handwriting classification and automatically generate the recommended therapy plan.",
        },
        {
            value: "Post-Test",
            title: "Post-Test Assessment",
            icon: RotateCcw,
            color: "green",
            description:
                "Conduct a reassessment after the student has completed handwriting therapy. The results will be compared with the Pre-Test to evaluate improvement.",
        },
    ];

    return (

        <div>
            {/* Header */}
            <div className="mb-10">
                <h2
                    className="
                        text-3xl
                        font-bold
                        text-slate-800
                    "
                >
                    Assessment Type
                </h2>
                <p
                    className="
                        mt-2
                        text-slate-500
                    "
                >
                    Select the assessment you want to conduct.
                </p>
            </div>

            {/* Options */}
            <div className="grid md:grid-cols-2 gap-8">

                {options.map((option) => {

                    const Icon = option.icon;

                    const active =
                        assessmentType === option.value;

                    return (

                        <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                                setAssessmentType(option.value)
                            }
                            className={`
                                relative
                                rounded-3xl
                                border-2
                                p-8
                                text-left
                                transition-all
                                duration-300
                                hover:shadow-xl
                                hover:-translate-y-1

                                ${
                                    active
                                        ? "border-[#9b4c00] bg-orange-50 shadow-lg"
                                        : "border-slate-200 bg-white"
                                }
                            `}
                        >

                            {/* Selected */}
                            {active && (
                                <div
                                    className="
                                        absolute
                                        top-5
                                        right-5
                                        text-green-600
                                    "
                                >
                                    <CheckCircle2 size={28} />
                                </div>
                            )}

                            {/* Icon */}
                            <div
                                className={`
                                    w-20
                                    h-20
                                    rounded-2xl
                                    flex
                                    items-center
                                    justify-center
                                    mb-6

                                    ${
                                        option.color === "orange"
                                            ? "bg-orange-100 text-orange-600"
                                            : "bg-green-100 text-green-600"
                                    }
                                `}
                            >
                                <Icon size={40} />
                            </div>

                            {/* Title */}
                            <h3
                                className="
                                    text-2xl
                                    font-bold
                                    text-slate-800
                                "
                            >
                                {option.title}
                            </h3>

                            {/* Description */}
                            <p
                                className="
                                    mt-4
                                    text-slate-600
                                    leading-relaxed
                                "
                            >
                                {option.description}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Information */}
            <div
                className="
                    mt-10
                    rounded-2xl
                    border-l-4
                    border-blue-500
                    bg-blue-50
                    p-6
                "
            >
                <h4
                    className="
                        text-lg
                        font-bold
                        text-blue-700
                    "
                >
                    Assessment Guide
                </h4>
                <ul
                    className="
                        mt-4
                        space-y-2
                        list-disc
                        pl-6
                        text-slate-700
                    "
                >
                    <li>
                        <strong>Pre-Test</strong> establishes the student's baseline handwriting performance before therapy begins.
                    </li>
                    <li>
                        <strong>Post-Test</strong> measures improvement after completing the prescribed handwriting therapy program.
                    </li>
                    <li>
                        Assessment results will automatically calculate the student's overall score, classification, and recommended therapy level.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AssessmentType;