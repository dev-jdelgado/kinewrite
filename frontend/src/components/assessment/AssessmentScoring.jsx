import { Target, Info } from "lucide-react";

import { useAssessment } from "../../contexts/AssessmentContext";

const AssessmentScoring = () => {

    const {
        scores,
        updateScore,
    } = useAssessment();

    const criteria = [
        {
            key: "visualMotor",
            title: "Visual-Motor Integration",
            description:
                "Evaluate the student's ability to coordinate visual perception with hand movement.",
        },
        {
            key: "fineMotor",
            title: "Fine Motor Skills",
            description:
                "Assess pencil control, grip, stability, and precision during handwriting.",
        },
        {
            key: "letterFormation",
            title: "Letter Formation",
            description:
                "Evaluate the correctness, consistency, spacing, and readability of written letters.",
        },
    ];

    return (

        <div>
            {/* Header */}
            <div className="mb-10">
                <h2
                    className="
                        text-3xl
                        font-bold
                        text-slate-800
                    "
                >
                    Assessment Scoring
                </h2>

                <p
                    className="
                        mt-2
                        text-slate-500
                    "
                >
                    Evaluate each assessment criterion using a score from
                    <strong> 0 to 100</strong>.
                </p>
            </div>

            {/* Assessment Criteria */}
            <div className="space-y-8">
                {criteria.map((criterion) => (

                    <div
                        key={criterion.key}
                        className="
                            bg-white
                            border
                            rounded-3xl
                            shadow-sm
                            p-8
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                lg:flex-row
                                lg:items-center
                                lg:justify-between
                                gap-8
                            "
                        >

                            {/* Left */}
                            <div className="flex-1">
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <Target
                                        className="text-orange-500"
                                    />
                                    <h3
                                        className="
                                            text-2xl
                                            font-bold
                                            text-slate-800
                                        "
                                    >
                                        {criterion.title}
                                    </h3>
                                </div>

                                <p
                                    className="
                                        mt-4
                                        text-slate-600
                                        leading-relaxed
                                    "
                                >
                                    {criterion.description}
                                </p>
                            </div>

                            {/* Right */}
                            <div
                                className="
                                    w-full
                                    lg:w-72
                                "
                            >
                                <label
                                    className="
                                        block
                                        mb-2
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Score
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={scores[criterion.key]}
                                    onChange={(e) => {

                                        let value = Number(e.target.value);

                                        if (value < 0) value = 0;
                                        if (value > 100) value = 100;

                                        updateScore(
                                            criterion.key,
                                            value
                                        );

                                    }}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        px-5
                                        py-4
                                        text-2xl
                                        font-bold
                                        outline-none
                                        focus:ring-2
                                        focus:ring-orange-400
                                    "
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Guide */}
            <div
                className="
                    mt-10
                    rounded-2xl
                    border-l-4
                    border-orange-500
                    bg-orange-50
                    p-6
                "
            >
                <div
                    className="
                        flex
                        items-start
                        gap-4
                    "
                >
                    <Info
                        className="
                            text-orange-600
                            mt-1
                        "
                    />
                    <div>
                        <h4
                            className="
                                text-lg
                                font-bold
                                text-orange-700
                            "
                        >
                            Scoring Guidelines
                        </h4>
                        <ul
                            className="
                                mt-3
                                list-disc
                                pl-5
                                space-y-2
                                text-slate-700
                            "
                        >
                            <li>
                                Enter a score between
                                <strong> 0 and 100</strong>.
                            </li>
                            <li>
                                Higher scores indicate better handwriting performance.
                            </li>
                            <li>
                                The assessment results are calculated automatically as scores are entered.
                            </li>
                            <li>
                                The student's handwriting classification and recommended therapy level will update automatically.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssessmentScoring;