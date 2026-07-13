// ======================================================
// WritingEfficiencyEvaluator
// Evaluates the overall efficiency of the handwriting
// process by combining multiple handwriting metrics.
// ======================================================

const WritingEfficiencyEvaluator = {

    evaluate(
        strokeMetrics,
        timeMetrics,
        distanceMetrics
    ) {

        const {
            strokeCount,
            totalPoints,
            averagePointsPerStroke,
        } = strokeMetrics;

        const {
            totalSeconds,
        } = timeMetrics;

        const {
            totalDistance,
        } = distanceMetrics;

        let score = 100;
        const remarks = [];

        // =============================================
        // Writing Duration
        // =============================================
        if (totalSeconds > 30) {
            score -= 15;

            remarks.push(
                "The handwriting task required additional completion time."
            );
        }

        else {
            remarks.push(
                "Writing duration is appropriate."
            );
        }

        // =============================================
        // Stroke Count
        // =============================================
        if (strokeCount < 5) {
            score -= 15;

            remarks.push(
                "Very few handwriting strokes were recorded."
            );
        }

        else {
            remarks.push(
                "Stroke count is appropriate."
            );
        }

        // =============================================
        // Point Density
        // =============================================
        if (averagePointsPerStroke < 15) {
            score -= 10;

            remarks.push(
                "Stroke detail appears limited."
            );
        }

        else {
            remarks.push(
                "Stroke detail appears sufficient."
            );
        }

        // =============================================
        // Writing Distance
        // =============================================
        if (totalDistance < 500) {
            score -= 10;

            remarks.push(
                "Limited handwriting movement was observed."
            );
        }

        else {
            remarks.push(
                "Hand movement appears sufficient."
            );
        }

        // =============================================
        // Total Points
        // =============================================
        if (totalPoints < 300) {
            score -= 10;

            remarks.push(
                "The handwriting sample may be incomplete."
            );
        }

        else {
            remarks.push(
                "A sufficient handwriting sample was captured."
            );
        }

        score = Math.max(
            0,
            Math.min(score, 100)
        );

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

export default WritingEfficiencyEvaluator;