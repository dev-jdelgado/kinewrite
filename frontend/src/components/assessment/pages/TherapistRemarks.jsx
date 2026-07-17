import {
    ClipboardCheck,
    FileText,
    Lightbulb,
    UserRoundCheck,
} from "lucide-react";

import {
    useState,
} from "react";

import AssessmentHeader from "../components/AssessmentHeader";
import AssessmentToolbar from "../components/AssessmentToolbar";

import { useAssessment } from "../utils/AssessmentContext";

const TherapistRemarks = () => {

    const {

        remarks,
        setRemarks,

        goToPage,

    } = useAssessment();

    const [

        recommendation,

        setRecommendation,

    ] = useState("");

    return (

        <div
            className="
                max-w-6xl
                mx-auto
            "
        >

            <AssessmentHeader

                title="Therapist Review"

                subtitle="Review the handwriting assessment before completing the pre-assessment."

            />

            {/* ===================================== */}
            {/* AI Summary */}
            {/* ===================================== */}

            <div
                className="
                    mt-8
                    bg-blue-50
                    border
                    border-blue-200
                    rounded-3xl
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

                    <ClipboardCheck
                        className="
                            text-blue-600
                        "
                    />

                    <h2
                        className="
                            text-2xl
                            font-bold
                        "
                    >
                        System Summary
                    </h2>

                </div>

                <ul
                    className="
                        space-y-3
                        text-slate-700
                    "
                >

                    <li>• Handwriting analysis completed successfully.</li>

                    <li>• Writing quality evaluated using KineWrite.</li>

                    <li>• Results are ready for therapist review.</li>

                </ul>

            </div>

            {/* ===================================== */}
            {/* Clinical Observation */}
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
                        Clinical Observation
                    </h2>

                </div>

                <textarea

                    rows={8}

                    value={remarks}

                    onChange={(event) =>
                        setRemarks(
                            event.target.value
                        )
                    }

                    placeholder="Write your clinical observations here..."

                    className="
                        w-full

                        rounded-2xl

                        border

                        border-slate-300

                        p-5

                        resize-none

                        focus:outline-none

                        focus:ring-2

                        focus:ring-[#9b4c00]
                    "

                />

            </div>

            {/* ===================================== */}
            {/* Recommendation */}
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

                    <Lightbulb
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
                        Initial Recommendation
                    </h2>

                </div>

                <select

                    value={recommendation}

                    onChange={(event) =>
                        setRecommendation(
                            event.target.value
                        )
                    }

                    className="
                        w-full

                        rounded-xl

                        border

                        border-slate-300

                        p-4
                    "

                >

                    <option value="">
                        Select Recommendation
                    </option>

                    <option value="spacing">
                        Improve Word Spacing
                    </option>

                    <option value="formation">
                        Improve Letter Formation
                    </option>

                    <option value="stroke">
                        Improve Stroke Control
                    </option>

                    <option value="mixed">
                        Mixed Intervention
                    </option>

                </select>

            </div>

            {/* ===================================== */}
            {/* Confirmation */}
            {/* ===================================== */}

            <div
                className="
                    mt-8

                    bg-green-50

                    border

                    border-green-200

                    rounded-3xl

                    p-8
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <UserRoundCheck
                        className="
                            text-green-600
                        "
                    />

                    <div>

                        <h3
                            className="
                                text-xl
                                font-bold
                            "
                        >
                            Therapist Verification
                        </h3>

                        <p
                            className="
                                mt-2

                                text-slate-600
                            "
                        >
                            By continuing, you confirm that the
                            assessment has been reviewed and is
                            ready for exercise plan generation.
                        </p>

                    </div>

                </div>

            </div>

            <AssessmentToolbar

                backLabel="Assessment Results"

                nextLabel="Complete Assessment"

                onBack={() =>
                    goToPage("results")
                }

                onNext={() =>
                    goToPage("complete")
                }

            />

        </div>

    );

};

export default TherapistRemarks;