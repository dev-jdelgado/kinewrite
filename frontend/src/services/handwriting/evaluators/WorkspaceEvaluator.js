// ======================================================
// WorkspaceEvaluator
// Evaluates how efficiently the student uses the
// available writing space.
// ======================================================

const WorkspaceEvaluator = {

    evaluate(boundingBoxMetrics) {

        const {
            width,
            height,
            area,
            aspectRatio,

        } = boundingBoxMetrics;

        let score = 100;

        const remarks = [];

        // =============================================
        // Writing Width
        // =============================================
        if (width < 250) {
            score -= 15;

            remarks.push(
                "Writing appears compressed horizontally."
            );
        }

        else if (width > 900) {
            score -= 10;

            remarks.push(
                "Writing occupies a wide horizontal area."
            );
        }

        else {
            remarks.push(
                "Horizontal spacing is appropriate."
            );
        }

        // =============================================
        // Writing Height
        // =============================================
        if (height < 80) {
            score -= 15;

            remarks.push(
                "Letter height appears smaller than expected."
            );
        }

        else if (height > 400) {
            score -= 10;

            remarks.push(
                "Letter height appears larger than expected."
            );
        }

        else {
            remarks.push(
                "Letter height is consistent."
            );
        }

        // =============================================
        // Workspace Area
        // =============================================
        if (area < 30000) {
            score -= 15;

            remarks.push(
                "Limited use of the writing workspace."
            );
        }

        else {
            remarks.push(
                "Writing space is used effectively."
            );
        }

        // =============================================
        // Aspect Ratio
        // =============================================
        if (aspectRatio > 6) {
            score -= 10;

            remarks.push(
                "Writing appears stretched horizontally."
            );
        }

        else if (aspectRatio < 1) {
            score -= 10;

            remarks.push(
                "Writing appears compressed vertically."
            );
        }

        else {
            remarks.push(
                "Writing proportions are balanced."
            );
        }

        score = Math.max(0, Math.min(score, 100));

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

export default WorkspaceEvaluator;