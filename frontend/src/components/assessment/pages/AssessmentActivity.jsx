import {
    useRef,
} from "react";

import {
    ArrowLeft,
} from "lucide-react";

import {
    useAssessment,
} from "../utils/AssessmentContext";

import AssessmentService from "../../../services/AssessmentService";

import BackButton from "../../common/BackButton";

import HandwritingWorksheet from "../handwriting/HandwritingWorksheet";
import HandwritingToolbar from "../handwriting/HandwritingToolbar";

import SkyBackground from "../../../assets/assessment/sky-background.png";
import Cloud from "../../../assets/assessment/cloud.png";
import Logo from "../../../assets/assessment/KineWrite-logo.png";

import Star from "../../../assets/assessment/star.png";

import Cat from "../../../assets/assessment/cat.png";
import Dog from "../../../assets/assessment/dog.png";
import Pen from "../../../assets/assessment/pen.png";
import Sun from "../../../assets/assessment/sun.png";
import Book from "../../../assets/assessment/book.png";

const illustrationMap = {

    cat: Cat,
    dog: Dog,
    pen: Pen,
    sun: Sun,
    books: Book,

};

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

    const illustration =
        illustrationMap[
            currentActivity.illustration
        ];

    const canCheck = canvasRef.current?.hasWriting?.() ?? false;

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
                                lg:text-[90px] text-[60px]
                                font-light
                                tracking-[0.35em]
                            "
                        >
                            {currentActivity.word}
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

                            {currentActivity.progress}

                            {" / "}

                            {currentActivity.total}

                        </div>

                    </div>

                    {/* Illustration */}

                    <div
                        className="
                            flex
                            justify-center
                            items-start
                            self-start
                            pt-6
                            absolute
                            z-1
                            lg:bottom-[80%] bottom-[80%]
                            -left-10
                        "
                    >

                        <img
                            src={illustration}
                            alt={currentActivity.word}
                            className="
                                lg:w-80
                                object-contain
                                select-none
                                pointer-events-none
                            "
                        />

                    </div>

                    {/* ====================================== */}
                    {/* Worksheet Card */}
                    {/* ====================================== */}

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

                        {/* Worksheet */}

                        <div
                            className="
                                inset-0
                            "
                        >

                            <HandwritingWorksheet

                                key={currentActivityIndex}

                                ref={canvasRef}

                                word={currentActivity.word}

                            />

                        </div>

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

                        disabled={!canCheck}

                    />

                </div>

            </div>

        </div>

    );

    // ==========================================
    // Clear Canvas
    // ==========================================

    function handleClear() {

        canvasRef.current?.clear();

    }

    // ==========================================
    // Proceed to Next Activity
    // ==========================================

    async function handleCheck() {

        const image =
        canvasRef.current?.exportImage?.();
    
        const strokes =
            canvasRef.current?.getStrokes?.() || [];
        
        // ======================================
        // Validation
        // ======================================
        
        const hasWriting =

            strokes.some(
        
                stroke =>
        
                    stroke.length > 1
        
            );
        
        if (!hasWriting) {
        
            alert(
        
                "Please write the word before checking."
        
            );
        
            return;
        
        }
    
        await AssessmentService.saveActivity(
    
            assessmentId,
    
            {
    
                activityNo: currentActivityIndex + 1,
    
                activityCategory: currentActivity.category,
    
                promptText: currentActivity.word,
    
                promptType: "Word",
    
                completionTime: 0,
    
                penLifts: strokes.length,
    
                strokeCount: strokes.length,
    
                image,
    
                strokes,
    
            }
    
        );
    
        canvasRef.current.clear();
    
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