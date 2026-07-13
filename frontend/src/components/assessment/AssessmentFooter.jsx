import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

import { useAssessment } from "../../contexts/AssessmentContext";

const AssessmentFooter = () => {

    const {
        currentStep,
        totalSteps,
        previousStep,
        nextStep,
    } = useAssessment();

    const isFirstStep = currentStep === 1;

    const isLastStep = currentStep === totalSteps;

    const handleComplete = () => {

        // TODO:
        // Save Assessment
        // Generate Exercise Plan
        // Update Student Progress
        // Redirect to Student Profile

        console.log("Assessment Completed");

    };

    return (

        <div
            className="
                mt-8
                bg-white
                rounded-3xl
                shadow-lg
                px-8
                py-6
            "
        >
            <div
                className="
                    flex
                    flex-col
                    md:flex-row
                    items-center
                    justify-between
                    gap-6
                "
            >
                {/* Step Information */}

                <div>
                    <p
                        className="
                            text-sm
                            text-slate-500
                        "
                    >
                        Step {currentStep} of {totalSteps}
                    </p>

                    <h3
                        className="
                            mt-1
                            text-lg
                            font-semibold
                            text-slate-800
                        "
                    >
                        {
                            isLastStep
                                ? "Review the assessment before completing."
                                : "Complete this step to continue."
                        }
                    </h3>
                </div>

                {/* Buttons */}
                <div
                    className="
                        flex
                        gap-4
                        w-full
                        md:w-auto
                    "
                >
                    <button
                        type="button"
                        onClick={previousStep}
                        disabled={isFirstStep}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            px-8
                            py-3
                            rounded-xl
                            border
                            font-semibold
                            text-slate-700
                            hover:bg-slate-100
                            transition-all
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            min-w-[170px]
                        "
                    >
                        <ArrowLeft size={20} />
                        Previous
                    </button>

                    {
                        !isLastStep
                        ?
                        (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-8
                                    py-3
                                    rounded-xl
                                    bg-[#9b4c00]
                                    hover:bg-[#7a3b00]
                                    text-white
                                    font-semibold
                                    transition-all
                                    shadow-lg
                                    min-w-[170px]
                                "
                            >
                                Next
                                <ArrowRight size={20} />
                            </button>
                        )
                        :
                        (
                            <button
                                type="button"
                                onClick={handleComplete}
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-8
                                    py-3
                                    rounded-xl
                                    bg-green-600
                                    hover:bg-green-700
                                    text-white
                                    font-semibold
                                    transition-all
                                    shadow-lg
                                    min-w-[230px]
                                "
                            >
                                <CheckCircle2 size={20} />
                                Complete Assessment
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default AssessmentFooter;