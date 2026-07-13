import {
    Sparkles,
    BookOpen,
    PencilLine,
    Cpu,
    BarChart3,
    FileText,
} from "lucide-react";

import { useAssessment } from "../../contexts/AssessmentContext";

const AssessmentStepper = () => {

    const {
        currentStep,
        totalSteps,
    } = useAssessment();

    const steps = [
        {
            title: "Welcome",
            icon: Sparkles,
        },
        {
            title: "Instructions",
            icon: BookOpen,
        },
        {
            title: "Writing",
            icon: PencilLine,
        },
        {
            title: "Analysis",
            icon: Cpu,
        },
        {
            title: "Results",
            icon: BarChart3,
        },
        {
            title: "Remarks",
            icon: FileText,
        },
    ];

    return (

        <div
            className="
                mt-8
                bg-white
                rounded-3xl
                shadow-lg
                px-8
                py-8
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                {steps.map((step, index) => {

                    const stepNumber = index + 1;

                    const Icon = step.icon;

                    const isCompleted =
                        stepNumber < currentStep;

                    const isActive =
                        stepNumber === currentStep;

                    return (
                        
                        <div
                            key={step.title}
                            className="
                                flex-1
                                flex
                                items-center
                            "
                        >

                            {/* Step */}
                            <div
                                className="
                                    flex
                                    flex-col
                                    items-center
                                    flex-shrink-0
                                "
                            >
                                <div
                                    className={`
                                        w-16
                                        h-16
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        transition-all
                                        duration-300

                                        ${
                                            isCompleted
                                                ? "bg-green-500 text-white"
                                                : isActive
                                                ? "bg-[#9b4c00] text-white ring-4 ring-orange-200"
                                                : "bg-slate-200 text-slate-500"
                                        }
                                    `}
                                >
                                    <Icon size={28} />
                                </div>

                                <span
                                    className={`
                                        mt-3
                                        text-sm
                                        font-semibold
                                        text-center

                                        ${
                                            isCompleted
                                                ? "text-green-600"
                                                : isActive
                                                ? "text-[#9b4c00]"
                                                : "text-slate-500"
                                        }
                                    `}
                                >
                                    {step.title}
                                </span>
                            </div>

                            {/* Connector */}
                            {
                                stepNumber !== totalSteps && (
                                    <div
                                        className="
                                            flex-1
                                            h-1
                                            mx-4
                                            rounded-full
                                            bg-slate-200
                                            overflow-hidden
                                        "
                                    >
                                        <div
                                            className={`
                                                h-full
                                                transition-all
                                                duration-500
                                                ${
                                                    isCompleted
                                                        ? "w-full bg-green-500"
                                                        : "w-0"
                                                }
                                            `}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AssessmentStepper;