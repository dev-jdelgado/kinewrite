class ScoreCalculator {

    // ==========================================
    // Calculate Overall Assessment
    // ==========================================

    static calculate(result) {

        const spacing =
            result.spacing?.score ?? 0;

        const alignment =
            result.alignment?.score ?? 0;

        const stroke =
            result.stroke?.score ?? 0;

        // ==========================================
        // Weighted Score
        // ==========================================

        const WEIGHTS = {

            spacing: 0.35,

            alignment: 0.35,

            stroke: 0.30,

        };

        const overallScore =

            (spacing * WEIGHTS.spacing) +

            (alignment * WEIGHTS.alignment) +

            (stroke * WEIGHTS.stroke);

        // ==========================================
        // Classification
        // ==========================================

        let classification;
        let therapyLevel;
        let remarks;

        if (overallScore >= 90) {

            classification = "Excellent";

            therapyLevel = 1;

            remarks =
                "Excellent handwriting performance.";

        }

        else if (overallScore >= 80) {

            classification = "Good";

            therapyLevel = 1;

            remarks =
                "Good handwriting with minor inconsistencies.";

        }

        else if (overallScore >= 70) {

            classification = "Fair";

            therapyLevel = 2;

            remarks =
                "Moderate handwriting inconsistencies detected.";

        }

        else if (overallScore >= 60) {

            classification = "Needs Improvement";

            therapyLevel = 3;

            remarks =
                "Noticeable handwriting difficulties detected.";

        }

        else {

            classification = "Poor";

            therapyLevel = 4;

            remarks =
                "Significant handwriting intervention recommended.";

        }

        // ==========================================
        // Weakest Skill
        // ==========================================

        const metrics = [

            {

                name: "Spacing",

                score: spacing,

            },

            {

                name: "Alignment",

                score: alignment,

            },

            {

                name: "Stroke",

                score: stroke,

            },

        ];

        metrics.sort(

            (a, b) => a.score - b.score

        );

        const weakestSkill = metrics[0].name;

        // ==========================================
        // Return
        // ==========================================

        return {

            overallScore: Number(

                overallScore.toFixed(2)

            ),

            classification,

            therapyLevel,

            remarks,

            weakestSkill,

            breakdown: {

                spacing,

                alignment,

                stroke,

            },

        };

    }

}

module.exports = ScoreCalculator;