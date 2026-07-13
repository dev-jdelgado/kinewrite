// ======================================================
// MovementFluencyEvaluator
// Evaluates handwriting fluency using movement distance
// and writing time metrics.
// ======================================================

const MovementFluencyEvaluator = {

    evaluate(distanceMetrics, timeMetrics) {

        const {

            totalDistance,
            averageStrokeDistance,

        } = distanceMetrics;

        const {

            totalSeconds,
            averageStrokeDuration,

        } = timeMetrics;

        let score = 100;

        const remarks = [];

        // =============================================
        // Writing Duration
        // =============================================
        if (totalSeconds > 30) {
            score -= 20;

            remarks.push(
                "Writing required a longer than expected duration."
            );
        }

        else if (totalSeconds > 20) {
            score -= 10;

            remarks.push(
                "Writing pace was slightly slow."
            );
        }

        else {
            remarks.push(
                "Writing duration is within the expected range."
            );
        }

        // =============================================
        // Stroke Duration
        // =============================================
        if (averageStrokeDuration > 4) {
            score -= 15;

            remarks.push(
                "Frequent pauses between strokes were detected."
            );
        }

        else if (averageStrokeDuration > 2.5) {
            score -= 8;

            remarks.push(
                "Minor hesitation was observed while writing."
            );
        }

        else {
            remarks.push(
                "Stroke rhythm appears consistent."
            );
        }

        // =============================================
        // Movement Distance
        // =============================================
        if (averageStrokeDistance < 120) {
            score -= 10;

            remarks.push(
                "Short handwriting movements were observed."
            );
        }

        else {
            remarks.push(
                "Hand movement appears continuous."
            );
        }

        // =============================================
        // Writing Speed
        // =============================================
        const writingSpeed =

            totalSeconds > 0
                ? totalDistance / totalSeconds
                : 0;

        if (writingSpeed < 80) {
            score -= 15;

            remarks.push(
                "Overall writing movement is slow."
            );
        }

        else if (writingSpeed < 120) {
            score -= 8;

            remarks.push(
                "Writing speed is slightly below average."
            );
        }

        else {
            remarks.push(
                "Writing speed appears appropriate."
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

            writingSpeed:
                Number(
                    writingSpeed.toFixed(2)
                ),
            remarks,

        };
    },
};

export default MovementFluencyEvaluator;