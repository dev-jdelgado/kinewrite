class ScoreCalculator {

    // ==========================================
    // Configurable Category Weights
    // ==========================================

    static WEIGHTS = {

        alignment: 0.40,

        spacing: 0.35,

        stroke: 0.25,

    };

    // ==========================================
    // Classification Thresholds
    // ==========================================

    static LEVELS = [

        {
            min: 90,
            classification: "Excellent",
            therapyLevel: 1,
            remarks:
                "Excellent handwriting performance.",
        },

        {
            min: 80,
            classification: "Good",
            therapyLevel: 1,
            remarks:
                "Good handwriting with minor inconsistencies.",
        },

        {
            min: 70,
            classification: "Fair",
            therapyLevel: 2,
            remarks:
                "Moderate handwriting inconsistencies detected.",
        },

        {
            min: 60,
            classification: "Needs Improvement",
            therapyLevel: 3,
            remarks:
                "Noticeable handwriting difficulties detected.",
        },

        {
            min: 0,
            classification: "Poor",
            therapyLevel: 4,
            remarks:
                "Significant handwriting intervention recommended.",
        },

    ];

    // ==========================================
    // Calculate Weighted Score
    // ==========================================

    static calculateOverall({

        alignment,

        spacing,

        stroke,

    }) {

        const alignmentScore =
            alignment?.score ?? 0;

        const spacingScore =
            spacing?.score ?? 0;

        const strokeScore =
            stroke?.score ?? 0;

        const overall =

            (alignmentScore * this.WEIGHTS.alignment) +

            (spacingScore * this.WEIGHTS.spacing) +

            (strokeScore * this.WEIGHTS.stroke);

        return Number(

            overall.toFixed(2)

        );

    }

    // ==========================================
    // Classification
    // ==========================================

    static classify(

        overallScore

    ) {

        return (

            this.LEVELS.find(

                level =>

                    overallScore >= level.min

            ) ||

            this.LEVELS.at(-1)

        );

    }

    // ==========================================
    // Weakest Skill
    // ==========================================

    static findWeakestSkill({

        alignment,

        spacing,

        stroke,

    }) {

        const metrics = [

            {

                name: "Alignment",

                score:

                    alignment?.score ?? 0,

            },

            {

                name: "Spacing",

                score:

                    spacing?.score ?? 0,

            },

            {

                name: "Stroke",

                score:

                    stroke?.score ?? 0,

            },

        ];

        return metrics.reduce(

            (lowest, current) =>

                current.score < lowest.score

                    ? current

                    : lowest

        ).name;

    }

    // ==========================================
    // Main Calculator
    // ==========================================

    static calculate({

        alignment,

        spacing,

        stroke,

    }) {

        const overallScore =

            this.calculateOverall({

                alignment,

                spacing,

                stroke,

            });

        const {

            classification,

            therapyLevel,

            remarks,

        } = this.classify(

            overallScore

        );

        const weakestSkill =

            this.findWeakestSkill({

                alignment,

                spacing,

                stroke,

            });

        return {

            overallScore,

            classification,

            therapyLevel,

            remarks,

            weakestSkill,

            breakdown: {

                alignment,

                spacing,

                stroke,

            },

        };

    }

}

module.exports = ScoreCalculator;