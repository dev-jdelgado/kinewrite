import { useEffect, useState } from "react";

import {
    Brain,
    CheckCircle2,
    LoaderCircle,
    AlertCircle,
} from "lucide-react";

import { useAssessment } from "../../contexts/AssessmentContext";
import HandwritingAnalysisService from "../../services/handwriting/HandwritingAnalysisService";

const analysisSteps = [
    "Validating handwriting sample...",
    "Calculating handwriting metrics...",
    "Evaluating stroke control...",
    "Evaluating movement fluency...",
    "Evaluating workspace usage...",
    "Evaluating writing efficiency...",
    "Determining handwriting classification...",
    "Generating therapy recommendation...",
    "Generating assessment summary...",
];

const SystemAnalysis = () => {

    const {
        handwritingData,
        handwritingImage,
        setAssessmentResult,
        analysisLoading,
        setAnalysisLoading,
        analysisError,
        setAnalysisError,
        nextStep,
    } = useAssessment();

    const [currentStep, setCurrentStep] =
        useState(0);

    useEffect(() => {

        if (handwritingData.length === 0) {

            setAnalysisError(
                "No handwriting sample was found."
            );
            return;
        }

        let cancelled = false;

        const runAnalysis = async () => {

            setAnalysisLoading(true);
            setAnalysisError(null);

            try {

                // Animate progress
                for (
                    let i = 0;
                    i < analysisSteps.length;
                    i++
                ) {
                    if (cancelled) return;
                    setCurrentStep(i);

                    await new Promise(resolve =>
                        setTimeout(resolve, 500)
                    );
                }

                if (cancelled) return;

                // Run handwriting engine
                const result =
                    await HandwritingAnalysisService.analyzeHandwriting(
                        handwritingData,
                        handwritingImage
                    );

                if (cancelled) return;

                // Save entire assessment
                setAssessmentResult(result);
                setAnalysisLoading(false);

                setTimeout(() => {
                    nextStep();
                }, 800);

            }

            catch (error) {
                console.error(error);

                setAnalysisLoading(false);

                setAnalysisError(
                    error.message ||
                    "Unable to analyze handwriting."
                );
            }
        };

        runAnalysis();

        return () => {
            cancelled = true;
        };
    }, []);

    return (

        <div className="flex flex-col items-center justify-center min-h-[650px]">

            {/* Icon */}
            <div className="w-36 h-36 rounded-full bg-orange-100 flex items-center justify-center shadow-xl">
                {
                    analysisError
                        ?
                        <AlertCircle
                            size={70}
                            className="text-red-600"
                        />
                        :
                        <Brain
                            size={70}
                            className="text-orange-600"
                        />
                }
            </div>

            {/* Title */}
            <h1 className="mt-10 text-5xl font-bold text-[#9b4c00] text-center">
                {
                    analysisError
                        ?
                        "Analysis Failed"
                        :
                        "Analyzing Handwriting"
                }
            </h1>

            {/* Description */}
            <p className="mt-5 text-xl text-slate-600 text-center max-w-3xl">
                {
                    analysisError
                        ?
                        analysisError
                        :
                        "KineWrite is evaluating the handwriting sample and generating an individualized assessment."
                }
            </p>

            {
                !analysisError &&
                (
                    <div className="mt-16 w-full max-w-3xl rounded-3xl border bg-white shadow-lg p-8">
                        {
                            analysisSteps.map((step, index) => {

                                const completed =
                                    index < currentStep;

                                const active =
                                    index === currentStep;

                                return (
                                    <div
                                        key={step}
                                        className="flex items-center gap-5 py-4"
                                    >
                                        {
                                            completed
                                                ?
                                                <CheckCircle2
                                                    className="text-green-600"
                                                />
                                                :
                                                active
                                                    ?
                                                    <LoaderCircle
                                                        className="animate-spin text-orange-600"
                                                    />
                                                    :
                                                    <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                                        }

                                        <span
                                            className={`
                                                text-lg
                                                ${
                                                    completed
                                                        ? "text-green-700 font-semibold"

                                                        : active
                                                            ? "text-[#9b4c00] font-semibold"
                                                            : "text-slate-400"
                                                }
                                            `}
                                        >
                                            {step}
                                        </span>
                                    </div>
                                );
                            })
                        }
                    </div>
                )
            }
        </div>
    );
};

export default SystemAnalysis;