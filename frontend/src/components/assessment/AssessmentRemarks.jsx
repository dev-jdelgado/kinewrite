import { useState } from "react";
import {
    ClipboardCheck,
    CheckCircle2,
    AlertTriangle,
    Save,
} from "lucide-react";

import { useAssessment } from "../../contexts/AssessmentContext";

const AssessmentRemarks = () => {

    const {
        assessmentResult,

        therapistRemarks,
        setTherapistRemarks,
    } = useAssessment();

    const [clinicalDecision, setClinicalDecision] =
        useState("Confirm Recommendation");

    if (!assessmentResult) {
        return (
            <div className="text-center py-20">
                <h2 className="text-3xl font-bold text-red-600">
                    Assessment not found.
                </h2>
            </div>
        );
    }

    const {
        classification,
        therapyRecommendation,
        summary,
    } = assessmentResult;

    const handleSave = () => {

        // Backend integration
        console.log({
            assessmentResult,
            therapistRemarks,
            clinicalDecision,
        });

        alert(
            "Assessment is ready to be saved to the database."
        );
    };

    return (

        <div className="max-w-6xl mx-auto space-y-8">

            {/* ========================================= */}
            <div className="bg-white rounded-3xl border shadow-lg p-10">
                <div className="flex items-center gap-3">
                    <ClipboardCheck
                        className="text-[#9b4c00]"
                        size={36}
                    />
                    <div>
                        <h1 className="text-4xl font-bold text-[#9b4c00]">
                            Clinical Review
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Review the automated assessment before saving.
                        </p>
                    </div>
                </div>
            </div>

            {/* ========================================= */}
            <div className="bg-white rounded-3xl border shadow p-8">
                <h2 className="text-2xl font-bold mb-5">
                    Automated Assessment
                </h2>

                <div className="space-y-3">
                    <p>
                        <strong>Classification:</strong>{" "}
                        {classification.severity}
                    </p>

                    <p>
                        <strong>Overall Score:</strong>{" "}
                        {classification.overallScore}%
                    </p>

                    <p>
                        <strong>Confidence:</strong>{" "}
                        {classification.confidence}%
                    </p>

                    <p className="leading-7">
                        {summary}
                    </p>
                </div>
            </div>

            {/* ========================================= */}
            <div className="bg-white rounded-3xl border shadow p-8">
                <h2 className="text-2xl font-bold mb-5">
                    Recommended Therapy
                </h2>

                <p>
                    <strong>Exercise Level:</strong>{" "}
                    Level {therapyRecommendation.exerciseLevel}
                </p>

                <p>
                    <strong>Session Duration:</strong>{" "}
                    {therapyRecommendation.sessionDuration} minutes
                </p>

                <p>
                    <strong>Weekly Frequency:</strong>{" "}
                    {therapyRecommendation.weeklyFrequency} sessions
                </p>
            </div>

            {/* ========================================= */}
            <div className="bg-white rounded-3xl border shadow p-8">
                <h2 className="text-2xl font-bold mb-5">
                    Therapist Decision
                </h2>

                <select
                    value={clinicalDecision}
                    onChange={(e) =>
                        setClinicalDecision(e.target.value)
                    }
                    className="w-full border rounded-xl p-4"
                >
                    <option>
                        Confirm Recommendation
                    </option>

                    <option>
                        Modify Therapy Plan
                    </option>

                    <option>
                        Reassess Student
                    </option>
                </select>
            </div>

            {/* ========================================= */}
            <div className="bg-white rounded-3xl border shadow p-8">
                <h2 className="text-2xl font-bold mb-5">
                    Therapist Remarks
                </h2>

                <textarea
                    rows={8}
                    value={therapistRemarks}
                    onChange={(e) =>
                        setTherapistRemarks(
                            e.target.value
                        )
                    }
                    placeholder="Enter your professional observations..."
                    className="w-full border rounded-xl p-5 resize-none"
                />
            </div>

            {/* ========================================= */}
            <div className="bg-green-50 border border-green-200 rounded-3xl p-8">
                <div className="flex items-center gap-3">
                    <CheckCircle2
                        className="text-green-600"
                    />
                    <div>
                        <h3 className="font-bold text-xl">
                            Ready to Save
                        </h3>
                        <p className="text-slate-600 mt-1">
                            This assessment will be stored
                            in the student's assessment history
                            and used to generate their exercise
                            plan.
                        </p>
                    </div>
                </div>
            </div>

            {/* ========================================= */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="bg-[#9b4c00] hover:bg-[#7d3c00] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3"
                >
                    <Save size={22} />
                    Save Assessment
                </button>
            </div>

        </div>
    );
};

export default AssessmentRemarks;