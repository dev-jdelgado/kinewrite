const FeatureExtractor = require("./FeatureExtractor");
const Geometry = require("./Geometry");

class StrokeAnalyzer {

    // ==========================================
    // Analyze Stroke Quality
    // ==========================================

    static analyze(strokes) {

        const features =
            FeatureExtractor.extract(strokes);

        const items =
            features.strokeFeatures;

        if (items.length === 0) {

            return {

                score: 0,

                strokeCount: 0,

                averageStrokeLength: 0,

                smoothness: 0,

                efficiency: 0,

            };

        }

        // ==========================================
        // Stroke Count
        // ==========================================

        const strokeCount = items.length;

        // ==========================================
        // Average Stroke Length
        // ==========================================

        const averageStrokeLength =
            features.totalStrokeLength /
            strokeCount;

        // ==========================================
        // Smoothness
        // ==========================================

        let totalAngleChange = 0;
        let totalSegments = 0;

        items.forEach(item => {

            const stroke = item.stroke;

            for (let i = 2; i < stroke.length; i++) {

                const p1 = stroke[i - 2];
                const p2 = stroke[i - 1];
                const p3 = stroke[i];

                const angle1 = Math.atan2(
                    p2.y - p1.y,
                    p2.x - p1.x
                );

                const angle2 = Math.atan2(
                    p3.y - p2.y,
                    p3.x - p2.x
                );

                let delta =
                    Math.abs(angle2 - angle1);

                if (delta > Math.PI) {
                    delta =
                        (Math.PI * 2) - delta;
                }

                totalAngleChange += delta;
                totalSegments++;

            }

        });

        const smoothness =
            totalSegments === 0
                ? 0
                : totalAngleChange / totalSegments;

        // ==========================================
        // Stroke Efficiency
        // ==========================================

        let efficiencySum = 0;

        items.forEach(item => {

            const stroke = item.stroke;

            if (stroke.length < 2) {

                efficiencySum += 1;
                return;

            }

            const directDistance =
                Geometry.distance(
                    item.firstPoint,
                    item.lastPoint
                );

            const pathLength =
                item.strokeLength;

            if (pathLength === 0) {

                efficiencySum += 1;
                return;

            }

            efficiencySum +=
                directDistance /
                pathLength;

        });

        const efficiency =
            efficiencySum /
            strokeCount;

        // ==========================================
        // Final Score
        // ==========================================

        const smoothnessScore =
            Math.max(
                0,
                100 - (smoothness * 22)
            );

        const efficiencyScore =
            efficiency * 100;

        let score =
            (smoothnessScore * 0.60) +
            (efficiencyScore * 0.40);

        score = Math.max(
            0,
            Math.min(100, score)
        );

        return {

            score: Number(
                score.toFixed(2)
            ),

            strokeCount,

            averageStrokeLength: Number(
                averageStrokeLength.toFixed(2)
            ),

            smoothness: Number(
                smoothness.toFixed(4)
            ),

            efficiency: Number(
                efficiency.toFixed(4)
            ),

        };

    }

}

module.exports = StrokeAnalyzer;