import {
    BadgeCheck,
    ClipboardCheck,
    FileText,
    Sparkles,
} from "lucide-react";

import AssessmentHeader from "../components/AssessmentHeader";
import AssessmentToolbar from "../components/AssessmentToolbar";

import { useAssessment } from "../utils/AssessmentContext";

const CompleteAssessment = () => {

    const {

        goToPage,

    } = useAssessment();

    return (

        <div
            className="
                max-w-6xl
                mx-auto
            "
        >

            <AssessmentHeader

                title="Complete Assessment"

                subtitle="Review the assessment before generating the student's personalized exercise plan."

            />

            {/* ===================================== */}
            {/* Success Banner */}
            {/* ===================================== */}

            <div
                className="
                    mt-8

                    bg-green-50

                    border

                    border-green-200

                    rounded-3xl

                    p-8

                    text-center
                "
            >

                <BadgeCheck
                    size={72}
                    className="
                        mx-auto
                        text-green-600
                    "
                />

                <h2
                    className="
                        mt-5

                        text-3xl

                        font-black

                        text-green-700
                    "
                >
                    Assessment Successfully Completed
                </h2>

                <p
                    className="
                        mt-3

                        text-lg

                        text-slate-600
                    "
                >
                    All handwriting activities have been completed
                    and reviewed by the therapist.
                </p>

            </div>

            {/* ===================================== */}
            {/* Checklist */}
            {/* ===================================== */}

            <div
                className="
                    mt-8

                    bg-white

                    rounded-3xl

                    shadow-lg

                    p-8
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        mb-6
                    "
                >

                    <ClipboardCheck
                        className="
                            text-[#9b4c00]
                        "
                    />

                    <h2
                        className="
                            text-2xl
                            font-bold
                        "
                    >
                        Assessment Checklist
                    </h2>

                </div>

                <div
                    className="
                        space-y-5
                    "
                >

                    <ChecklistItem
                        label="All handwriting activities completed"
                    />

                    <ChecklistItem
                        label="System analysis generated"
                    />

                    <ChecklistItem
                        label="Assessment results reviewed"
                    />

                    <ChecklistItem
                        label="Therapist remarks completed"
                    />

                </div>

            </div>

            {/* ===================================== */}
            {/* Summary */}
            {/* ===================================== */}

            <div
                className="
                    mt-8

                    bg-white

                    rounded-3xl

                    shadow-lg

                    p-8
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        mb-5
                    "
                >

                    <FileText
                        className="
                            text-[#9b4c00]
                        "
                    />

                    <h2
                        className="
                            text-2xl
                            font-bold
                        "
                    >
                        Next Step
                    </h2>

                </div>

                <p
                    className="
                        text-slate-600
                        leading-8
                    "
                >
                    KineWrite will use the assessment results,
                    handwriting analysis, and therapist observations
                    to generate a personalized handwriting exercise
                    plan tailored to the student's needs.
                </p>

            </div>

            {/* ===================================== */}
            {/* Generate Exercise Plan */}
            {/* ===================================== */}

            <div
                className="
                    mt-8

                    rounded-3xl

                    bg-orange-50

                    border

                    border-orange-200

                    p-8
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-4
                    "
                >

                    <Sparkles
                        className="
                            text-[#9b4c00]
                        "
                    />

                    <div>

                        <h3
                            className="
                                text-xl
                                font-bold
                            "
                        >
                            Ready to Generate Exercise Plan
                        </h3>

                        <p
                            className="
                                mt-2

                                text-slate-600
                            "
                        >
                            Continue to automatically generate the
                            student's individualized handwriting
                            exercise program.
                        </p>

                    </div>

                </div>

            </div>

            <AssessmentToolbar

                backLabel="Therapist Review"

                nextLabel="Generate Exercise Plan"

                onBack={() =>
                    goToPage("remarks")
                }

                onNext={() =>
                    goToPage("exercise-plan")
                }

            />

        </div>

    );

};

const ChecklistItem = ({

    label,

}) => (

    <div
        className="
            flex
            items-center
            gap-4
        "
    >

        <BadgeCheck
            className="
                text-green-600
            "
        />

        <span
            className="
                text-lg
                text-slate-700
            "
        >
            {label}
        </span>

    </div>

);

export default CompleteAssessment;