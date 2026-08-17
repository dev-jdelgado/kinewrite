import {
    useRef,
} from "react";

import {
    useAssessment,
} from "../utils/AssessmentContext";

import AssessmentService from "../../../services/AssessmentService";

import BackButton from "../../common/BackButton";

import HandwritingWorksheet from "../handwriting/HandwritingWorksheet";
import HandwritingToolbar from "../handwriting/HandwritingToolbar";

import Cloud from "../../../assets/assessment/cloud.png";
import Logo from "../../../assets/assessment/KineWrite-logo.png";

const AssessmentActivity = () => {

    const canvasRef = useRef(null);

    const {

        assessmentId,

        activities,

        currentActivity,

        currentActivityIndex,

        nextActivity,

        goToPage,

    } = useAssessment();

    if (!currentActivity) {

        return null;

    }

    const canCheck =
        canvasRef.current?.hasWriting?.() ?? false;

    return (

        <div
            className="
                relative
                min-h-screen
                flex
                flex-col
            "
        >

            {/* Clouds */}

            <img
                src={Cloud}
                alt=""
                className="
                    absolute
                    bottom-0
                    left-0
                    w-full
                    pointer-events-none
                    select-none
                "
            />

            {/* Content */}

            <div
                className="
                    relative
                    z-10
                    flex
                    flex-col
                    px-8
                    pt-6
                    pb-20
                "
            >

                {/* Header */}

                <div
                    className="
                        flex
                        justify-between
                        items-start
                    "
                >

                    <BackButton />

                    <img
                        src={Logo}
                        alt="KineWrite"
                        className="
                            w-48
                            object-contain
                        "
                    />

                </div>

                {/* Activity Header */}

                <div
                    className="
                        flex-1
                        text-center
                        px-10
                    "
                >

                    <h1
                        className="
                            text-4xl
                            font-black
                            tracking-wide
                            uppercase
                            text-sky-500
                        "
                    >
                        {currentActivity.title}
                    </h1>

                    <p
                        className="
                            text-2xl
                            font-semibold
                            text-sky-700
                        "
                    >
                        {currentActivity.instruction}
                    </p>

                </div>

                {/* Word Card */}

                <div
                    className="
                        mt-6
                        flex
                        justify-center
                    "
                >

                    <div
                        className="
                            bg-white
                            rounded-[40px]
                            shadow-2xl
                            border-[5px]
                            border-sky-400
                            px-24
                            max-w-[850px]
                            w-full
                            text-center
                        "
                    >

                        <h2
                            className="
                                lg:text-[90px]
                                text-[60px]
                                font-light
                                tracking-[0.35em]
                            "
                        >
                            {currentActivity.promptText}
                        </h2>

                    </div>

                </div>

                {/* ========================================== */}
                {/* Worksheet Section */}
                {/* ========================================== */}

                <div
                    className="
                        flex-1
                        mt-10
                        flex
                        items-center
                        justify-center
                        relative
                        max-w-[1440px]
                        w-full
                        mx-auto
                    "
                >

                    {/* Progress */}

                    <div
                        className="
                            flex
                            justify-center
                            z-20
                            absolute
                            -top-7
                        "
                    >

                        <div
                            className="
                                bg-sky-200
                                border-[4px]
                                border-sky-500
                                rounded-full
                                px-12
                                py-2
                                text-4xl
                                font-black
                                text-sky-700
                            "
                        >

                            {currentActivityIndex + 1}

                            {" / "}

                            {activities.length}

                        </div>

                    </div>

                    {/* Worksheet Card */}

                    <div
                        className="
                            relative
                            flex-1
                            h-full
                            max-h-[700px]
                            rounded-[40px]
                            bg-white
                            shadow-2xl
                            overflow-hidden
                        "
                    >

                        <HandwritingWorksheet
                            key={currentActivityIndex}
                            ref={canvasRef}
                            activity={currentActivity}
                        />

                    </div>

                </div>

                {/* ========================================== */}
                {/* Bottom Toolbar */}
                {/* ========================================== */}

                <div
                    className="
                        mt-3
                        flex
                        justify-center
                    "
                >

                    <HandwritingToolbar
                        onClear={handleClear}
                        onCheck={handleCheck}
                        disableCheck={!canCheck}
                    />

                </div>

            </div>

        </div>

    );

    // ==========================================
    // Clear Canvas
    // ==========================================

    function handleClear() {

        canvasRef.current?.clear?.();

    }

    // ==========================================
    // Proceed to Next Activity
    // ==========================================

    async function handleCheck() {

        const image =
            canvasRef.current?.exportImage?.();
        
        const referenceImage =
            await canvasRef.current?.exportReferenceImage?.();
        
        const strokes =
            canvasRef.current?.getStrokes?.() || [];
        
        const guide =
            canvasRef.current?.getGuideMetrics?.();

        const hasWriting =

            strokes.some(

                stroke =>

                    Array.isArray(stroke) &&
                    stroke.length > 1

            );

        if (!hasWriting) {

            alert(
                "Please complete the activity before checking."
            );

            return;

        }

        // ======================================
        // Debug
        // ======================================

        // console.log(
        //     "Assessment Activity:",
        //     {
        //         activityNo:
        //             currentActivityIndex + 1,

        //         activityCategory:
        //             currentActivity.category,

        //         activityType:
        //             currentActivity.activityType,

        //         promptText:
        //             currentActivity.promptText,

        //         guide,

        //         strokes,

        //     }
        // );

        // ======================================
        // Save Activity
        // ======================================

        await AssessmentService.saveActivity(
            assessmentId,
            {
                activityNo:
                    currentActivityIndex + 1,
        
                activityCategory:
                    currentActivity.category,
        
                activityName:
                    currentActivity.activityName,
        
                activityType:
                    currentActivity.activityType,
        
                promptText:
                    currentActivity.promptText,
        
                promptType:
                    currentActivity.promptType,
        
                completionTime:
                    0,
        
                penLifts:
                    strokes.length,
        
                strokeCount:
                    strokes.length,
        
                image,
        
                referenceImage,
        
                strokes,
        
                guide,
            }
        );

        // ======================================
        // Clear Current Activity
        // ======================================

        canvasRef.current?.clear?.();

        // ======================================
        // Next Activity / Analysis
        // ======================================

        if (

            currentActivityIndex ===
            activities.length - 1

        ) {

            goToPage("analysis");

        }

        else {

            nextActivity();

        }

    }

};

export default AssessmentActivity;