const FeatureExtractor = require("./FeatureExtractor");

class AlignmentAnalyzer {

    // ==========================================
    // Analyze Baseline Alignment
    // ==========================================

    static analyze(strokes) {

        const features =
            FeatureExtractor.extract(strokes);

        const items =
            features.strokeFeatures;

        if (items.length === 0) {

            return {

                score: 0,

                averageBaseline: 0,

                baselineDeviation: 0,

                baselines: [],

            };

        }

        // ==========================================
        // Collect Baselines
        // ==========================================

        const baselines =
            items.map(item => item.baseline);

        // ==========================================
        // Average Baseline
        // ==========================================

        const averageBaseline =
            baselines.reduce(

                (sum, value) => sum + value,

                0

            ) / baselines.length;

        // ==========================================
        // Standard Deviation
        // ==========================================

        const variance =
            baselines.reduce(

                (sum, value) => {

                    return sum +

                        Math.pow(

                            value - averageBaseline,

                            2

                        );

                },

                0

            ) / baselines.length;

        const baselineDeviation =
            Math.sqrt(variance);

        // ==========================================
        // Consistency
        // ==========================================

        const tolerance = 8;

        const alignedCount =
            baselines.filter(

                baseline =>

                    Math.abs(

                        baseline -

                        averageBaseline

                    ) <= tolerance

            ).length;

        const consistency =
            alignedCount /

            baselines.length;

        // ==========================================
        // Final Score
        // ==========================================

        let score =
            (consistency * 70) +

            (Math.max(

                0,

                30 - baselineDeviation

            ));

        score = Math.max(

            0,

            Math.min(

                100,

                score

            )

        );

        return {

            score: Number(

                score.toFixed(2)

            ),

            averageBaseline: Number(

                averageBaseline.toFixed(2)

            ),

            baselineDeviation: Number(

                baselineDeviation.toFixed(2)

            ),

            consistency: Number(

                (consistency * 100).toFixed(2)

            ),

            baselines:

                baselines.map(

                    value =>

                        Number(

                            value.toFixed(2)

                        )

                ),

        };

    }

}

module.exports = AlignmentAnalyzer;