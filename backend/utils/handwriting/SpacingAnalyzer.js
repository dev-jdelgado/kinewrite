const FeatureExtractor = require("./FeatureExtractor");

class SpacingAnalyzer {

    // ==========================================
    // Analyze Spacing
    // ==========================================

    static analyze(strokes) {

        const features =
            FeatureExtractor.extract(strokes);

        const items = features.strokeFeatures;

        if (items.length < 2) {

            return {

                score: 100,

                averageSpacing: 0,

                spacingVariance: 0,

                spacingDistances: [],

            };

        }

        // ==========================================
        // Sort Left to Right
        // ==========================================

        items.sort((a, b) => a.centerX - b.centerX);

        // ==========================================
        // Compute Horizontal Gaps
        // ==========================================

        const gaps = [];

        for (let i = 1; i < items.length; i++) {

            const previous = items[i - 1];
            const current = items[i];

            const gap =
                current.boundingBox.minX -
                previous.boundingBox.maxX;

            gaps.push(Math.max(0, gap));

        }

        // ==========================================
        // Average Gap
        // ==========================================

        const averageSpacing =
            gaps.reduce((a, b) => a + b, 0) /
            gaps.length;

        // ==========================================
        // Variance
        // ==========================================

        const spacingVariance =
            gaps.reduce((sum, gap) => {

                return sum +
                    Math.pow(
                        gap - averageSpacing,
                        2
                    );

            }, 0) / gaps.length;

        // ==========================================
        // Convert To Score
        // ==========================================

        const deviation =
            Math.sqrt(spacingVariance);

        let score =
            100 - (deviation * 2);

        score = Math.max(
            0,
            Math.min(100, score)
        );

        return {

            score: Number(
                score.toFixed(2)
            ),

            averageSpacing: Number(
                averageSpacing.toFixed(2)
            ),

            spacingVariance: Number(
                spacingVariance.toFixed(2)
            ),

            spacingDistances:
                gaps.map(v =>
                    Number(v.toFixed(2))
                ),

        };

    }

}

module.exports = SpacingAnalyzer;