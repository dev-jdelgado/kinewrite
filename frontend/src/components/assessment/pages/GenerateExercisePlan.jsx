import {
    Brain,
    CheckCircle2,
    Dumbbell,
    Sparkles,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import AssessmentHeader from "../components/AssessmentHeader";

import {
    useAssessment,
} from "../utils/AssessmentContext";

import exerciseData from "../../../utils/exerciseData";


const GenerateExercisePlan = () => {

    const navigate =
        useNavigate();


    const {
        analysis,
        student,
        remarks,
        setExercisePlan,
    } = useAssessment();


    // ==========================================
    // Determine Category Scores
    // ==========================================

    const scores = {

        alignment:
            Number(
                analysis?.breakdown?.alignment?.score ?? 0
            ),

        spacing:
            Number(
                analysis?.breakdown?.spacing?.score ?? 0
            ),

        stroke:
            Number(
                analysis?.breakdown?.stroke?.score ?? 0
            ),

    };


    // ==========================================
    // Determine Priority
    // Lowest score = highest priority
    // ==========================================

    const priority =
        Object.entries(scores)
            .sort(
                (
                    [, a],
                    [, b]
                ) => a - b
            )
            .map(
                ([category]) =>
                    category
            );


    // ==========================================
    // Generate Personalized Plan
    // ==========================================

    const recommendedActivities =
        priority.flatMap(
            category =>

                exerciseData.filter(
                    activity =>
                        activity.category ===
                        category
                )

        );


    // Limit first plan to 5 activities
    // so the student is not overwhelmed.

    const exercisePlan =
        recommendedActivities.slice(
            0,
            5
        );


    // ==========================================
    // Save Plan + Start
    // ==========================================

    const handleStartExercises = () => {

        setExercisePlan(
            exercisePlan
        );


        localStorage.setItem(

            `kinewrite-exercise-plan-${student?.student_id}`,

            JSON.stringify(
                exercisePlan
            )

        );


        navigate(
            `/exercise/${student?.student_id}`,
            {
                state: {
                    activity:
                        exercisePlan[0],
                },
            }
        );

    };


    return (

        <div
            className="
                py-10
                max-w-6xl
                mx-auto
            "
        >

            <AssessmentHeader

                title="Personalized Exercise Plan"

                subtitle="KineWrite has generated activities based on the student's assessment results."

            />


            {/* ===================================== */}
            {/* Assessment Summary */}
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
                        gap-4
                    "
                >

                    <Brain
                        className="
                            text-blue-600
                        "
                        size={32}
                    />

                    <div>

                        <h2
                            className="
                                text-2xl
                                font-bold
                            "
                        >
                            Personalized Plan
                        </h2>

                        <p
                            className="
                                mt-2
                                text-slate-600
                            "
                        >
                            Activities are prioritized according
                            to the student's lowest assessment scores.
                        </p>

                    </div>

                </div>


                <div
                    className="
                        mt-6
                        grid
                        md:grid-cols-3
                        gap-4
                    "
                >

                    <Score
                        label="Alignment"
                        value={scores.alignment}
                    />

                    <Score
                        label="Spacing"
                        value={scores.spacing}
                    />

                    <Score
                        label="Stroke"
                        value={scores.stroke}
                    />

                </div>

            </div>


            {/* ===================================== */}
            {/* Recommended Activities */}
            {/* ===================================== */}

            <div
                className="
                    mt-8
                    space-y-5
                "
            >

                {exercisePlan.map(
                    (
                        activity,
                        index
                    ) => (

                        <div
                            key={activity.id}
                            className="
                                bg-white
                                rounded-3xl
                                shadow-lg
                                p-7
                                flex
                                items-center
                                gap-5
                            "
                        >

                            <div
                                className="
                                    w-14
                                    h-14
                                    rounded-full
                                    bg-orange-100
                                    flex
                                    items-center
                                    justify-center
                                    font-black
                                    text-[#9b4c00]
                                "
                            >
                                {index + 1}
                            </div>


                            <div
                                className="
                                    flex-1
                                "
                            >

                                <div
                                    className="
                                        text-xs
                                        font-black
                                        uppercase
                                        tracking-widest
                                        text-slate-400
                                    "
                                >
                                    {activity.category}
                                </div>


                                <h3
                                    className="
                                        mt-1
                                        text-xl
                                        font-bold
                                    "
                                >
                                    {activity.title}
                                </h3>


                                <p
                                    className="
                                        mt-2
                                        text-slate-600
                                    "
                                >
                                    {activity.description}
                                </p>

                            </div>


                            <CheckCircle2
                                className="
                                    text-green-600
                                "
                                size={30}
                            />

                        </div>

                    )
                )}

            </div>


            {/* ===================================== */}
            {/* Therapist Notes */}
            {/* ===================================== */}

            {remarks && (

                <div
                    className="
                        mt-8
                        bg-yellow-50
                        border
                        border-yellow-200
                        rounded-3xl
                        p-7
                    "
                >

                    <p
                        className="
                            font-bold
                            text-yellow-700
                        "
                    >
                        Therapist Notes
                    </p>

                    <p
                        className="
                            mt-2
                            text-slate-700
                        "
                    >
                        {remarks}
                    </p>

                </div>

            )}


            {/* ===================================== */}
            {/* Start */}
            {/* ===================================== */}

            <div
                className="
                    mt-10
                    flex
                    justify-center
                "
            >

                <button
                    onClick={
                        handleStartExercises
                    }

                    className="
                        inline-flex
                        items-center
                        gap-4
                        px-10
                        py-5
                        rounded-2xl
                        bg-[#9b4c00]
                        hover:bg-[#7d3e00]
                        text-white
                        text-xl
                        font-black
                        shadow-xl
                        transition
                    "
                >

                    <Dumbbell size={28} />

                    Start Exercises

                    <Sparkles size={24} />

                </button>

            </div>

        </div>

    );

};


const Score = ({
    label,
    value,
}) => (

    <div
        className="
            bg-white
            rounded-2xl
            p-5
            text-center
            shadow
        "
    >

        <div
            className="
                text-sm
                font-bold
                text-slate-400
                uppercase
            "
        >
            {label}
        </div>

        <div
            className="
                mt-2
                text-4xl
                font-black
                text-sky-600
            "
        >
            {value.toFixed(1)}%
        </div>

    </div>

);


export default GenerateExercisePlan;