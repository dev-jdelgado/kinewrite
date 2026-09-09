import {
    Award,
    AlignHorizontalSpaceAround,
    MoveVertical,
    PenTool,
    ArrowRight,
} from "lucide-react";

import {
    useAssessment,
} from "../utils/AssessmentContext";

const AssessmentResults = () => {

    const {

        analysis,

        goToPage,

    } = useAssessment();

    if (!analysis) {

        return null;

    }

    return (

        <div
            className="
                max-w-7xl
                mx-auto
                py-10
                px-6
            "
        >

            {/* ========================================== */}
            {/* Header */}
            {/* ========================================== */}

            <div className="text-center">

                <h1
                    className="
                        sm:text-5xl text-3xl
                        font-black
                        text-sky-600
                    "
                >
                    Assessment Results
                </h1>

                <p
                    className="
                        mt-4
                        text-xl
                        text-slate-600
                    "
                >
                    The handwriting assessment has been completed successfully.
                </p>

            </div>

            {/* ========================================== */}
            {/* Overall Score */}
            {/* ========================================== */}

            <div
                className="
                    mt-12

                    bg-white

                    rounded-[40px]

                    shadow-xl

                    sm:p-10 p-5

                    text-center
                "
            >

                <Award
                    size={60}
                    className="
                        mx-auto
                        text-yellow-500
                    "
                />

                <h2
                    className="
                        mt-4
                        text-3xl
                        font-bold
                    "
                >
                    Overall Score
                </h2>

                <p
                    className="
                        mt-5

                        sm:text-7xl text-5xl

                        font-black

                        text-sky-600
                    "
                >
                    {Number(analysis.overallScore ?? 0).toFixed(1)}%
                </p>

                <p
                    className="
                        mt-6

                        text-2xl

                        font-semibold

                        text-slate-700
                    "
                >
                    Classification:
                    {" "}
                    <span className="text-sky-600">

                        {analysis.classification}

                    </span>

                </p>

                <p
                    className="
                        mt-3

                        text-lg

                        text-slate-500
                    "
                >
                    Recommended Exercise Level:
                    {" "}
                    <strong>

                        {analysis.therapyLevel}

                    </strong>
                </p>

            </div>

            {/* ========================================== */}
            {/* Individual Scores */}
            {/* ========================================== */}

            <div
                className="
                    sm:mt-10 mt-5

                    grid

                    lg:grid-cols-3

                    sm:gap-8 gap-4
                "
            >

                <ScoreCard
                    title="Spacing"
                    score={Number(
                        analysis.breakdown?.spacing?.score ?? 0
                    ).toFixed(1)}
                />

                <ScoreCard
                    title="Alignment"
                    score={Number(
                        analysis.breakdown?.alignment?.score ?? 0
                    ).toFixed(1)}
                />

                <ScoreCard
                    title="Stroke"
                    score={Number(
                        analysis.breakdown?.stroke?.score ?? 0
                    ).toFixed(1)}
                />

            </div>

            {/* ========================================== */}
            {/* Continue */}
            {/* ========================================== */}

            <div
                className="
                    mt-14

                    flex

                    justify-center
                "
            >

                <button

                    onClick={() =>

                        goToPage("remarks")

                    }

                    className="
                        inline-flex

                        items-center

                        gap-4

                        rounded-2xl

                        bg-sky-500

                        hover:bg-sky-600

                        px-10

                        py-5

                        text-xl

                        font-bold

                        text-white

                        transition-all
                    "
                >

                    Continue

                    <ArrowRight size={28} />

                </button>

            </div>

        </div>

    );

};

const ScoreCard = ({

    icon,

    title,

    score,

}) => (

    <div
        className="
            bg-white

            rounded-[35px]

            shadow-xl

            sm:p-8 p-4

            text-center
        "
    >

        <div
            className="
                flex

                justify-center

                text-sky-500
            "
        >

            {icon}

        </div>

        <h3
            className="

                text-2xl

                font-bold
            "
        >

            {title}

        </h3>

        <p
            className="
                mt-2

                sm:text-6xl text-4xl

                font-black

                text-sky-600
            "
        >

            {score}%

        </p>

    </div>

);

export default AssessmentResults;