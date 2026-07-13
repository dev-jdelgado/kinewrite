// ======================================================
// StrokeControlEvaluator
// Evaluates handwriting stroke control using
// calculated stroke metrics.
// ======================================================

const StrokeControlEvaluator = {

    evaluate(metrics) {

        const {
            strokeCount,
            totalPoints,
            penLifts,
            averagePointsPerStroke,

        } = metrics;
        let score = 100;
        const remarks = [];

        // --------------------------------------------------
        // Pen Lifts
        // --------------------------------------------------
        if (penLifts > 12) {
            score -= 20;

            remarks.push(
                "Frequent pen lifts were detected."
            );
        }

        else if (penLifts > 8) {
            score -= 10;

            remarks.push(
                "Several pen lifts were observed."
            );
        }

        else {
            remarks.push(
                "Pen movement appears consistent."
            );
        }

        // --------------------------------------------------
        // Stroke Count
        // --------------------------------------------------

        if (strokeCount < 5) {
            score -= 15;
            remarks.push(
                "Very few handwriting strokes were recorded."
            );
        }

        // --------------------------------------------------
        // Point Density
        // --------------------------------------------------
        if (averagePointsPerStroke < 15) {
            score -= 10;
            remarks.push(
                "Stroke detail appears limited."
            );
        }

        if (totalPoints < 300) {
            score -= 10;
            remarks.push(
                "The handwriting sample may be incomplete."
            );
        }

        score = Math.max(0, Math.min(100, score));

        return {

            score,
            level:
                score >= 90
                    ? "Excellent"

                : score >= 80
                    ? "Good"

                : score >= 70
                    ? "Fair"
                : "Needs Improvement",

            remarks,
        };
    },
};

export default StrokeControlEvaluator;