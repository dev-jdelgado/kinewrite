import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    PencilLine,
    Type,
} from "lucide-react";

import { useAssessment } from "../../contexts/AssessmentContext";

import HandwritingWorksheet from "./handwriting/HandwritingWorksheet";
import HandwritingCanvas from "./handwriting/HandwritingCanvas";
import HandwritingToolbar from "./handwriting/HandwritingToolbar";

const WritingActivity = () => {

    const canvasRef = useRef(null);

    const {
        nextStep,
        handwritingData,
    } = useAssessment();

    const [elapsedTime, setElapsedTime] =
        useState(0);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    // ==========================================
    // Timer
    // ==========================================
    useEffect(() => {

        const timer = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);

    }, []);

    // ==========================================
    // Clear Canvas
    // ==========================================
    const handleClear = () => {

        canvasRef.current?.clear();

        setElapsedTime(0);

    };

    // ==========================================
    // Submit
    // ==========================================
    const handleSubmit = async () => {

        if (handwritingData.length === 0) {
            alert(
                "Please complete the handwriting activity first."
            );
            return;
        }

        setIsSubmitting(true);

        // Temporary delay to simulate upload

        setTimeout(() => {

            setIsSubmitting(false);
            nextStep();

        }, 1500);
    };

    return (

        <div className="space-y-8">

            {/* Header */}
            <div className="text-center">
                <div
                    className="
                        w-24
                        h-24
                        rounded-full
                        bg-orange-100
                        flex
                        items-center
                        justify-center
                        mx-auto
                        text-orange-600
                    "
                >

                    <PencilLine size={42} />

                </div>

                <h1
                    className="
                        mt-6
                        text-4xl
                        font-bold
                        text-[#9b4c00]
                    "
                >
                    Handwriting Activity
                </h1>

                <p
                    className="
                        mt-4
                        text-xl
                        text-slate-600
                        max-w-3xl
                        mx-auto
                    "
                >
                    Write the sentence below as neatly as you can.
                </p>
            </div>

            {/* Reference Sentence */}
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
                        items-center
                        gap-3
                        mb-5
                    "
                >
                    <Type
                        className="text-[#9b4c00]"
                    />
                    <h2
                        className="
                            text-xl
                            font-bold
                            text-[#9b4c00]
                        "
                    >
                        Reference Sentence
                    </h2>
                </div>

                <p
                    className="
                        text-3xl
                        font-semibold
                        text-slate-800
                        text-center
                    "
                >
                    The quick brown fox jumps over the lazy dog.
                </p>
            </div>

            {/* Worksheet */}
            <div
                className="
                    relative
                    rounded-3xl
                    overflow-hidden
                    shadow-lg
                "
            >

                <HandwritingWorksheet />

                <HandwritingCanvas
                    ref={canvasRef}
                />

            </div>

            {/* Toolbar */}
            <HandwritingToolbar
                elapsedTime={elapsedTime}
                onClear={handleClear}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />

        </div>
    );
};

export default WritingActivity;