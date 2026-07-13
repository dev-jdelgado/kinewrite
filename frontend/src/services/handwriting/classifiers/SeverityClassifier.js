// ======================================================
// SeverityClassifier
// Combines all evaluator scores into a single
// handwriting assessment.
// ======================================================

const SeverityClassifier = {

    classify({
        strokeControl,
        movementFluency,
        workspace,
        writingEfficiency,
    }) {

        // =============================================
        // Weighted Average
        // =============================================
        const weights = {
            strokeControl: 0.35,
            movementFluency: 0.25,
            workspace: 0.20,
            writingEfficiency: 0.20,
        };

        const overallScore = Number(
            (
                (strokeControl.score * weights.strokeControl) +
                (movementFluency.score * weights.movementFluency) +
                (workspace.score * weights.workspace) +
                (writingEfficiency.score * weights.writingEfficiency)
            ).toFixed(2)

        );

        // =============================================
        // Severity
        // =============================================
        let severity;

        if (overallScore >= 90) {
            severity = "No Significant Indicators";
        }

        else if (overallScore >= 80) {
            severity = "Mild Dysgraphia";
        }

        else if (overallScore >= 65) {
            severity = "Moderate Dysgraphia";
        }

        else {
            severity = "Severe Dysgraphia";
        }

        // =============================================
        // Confidence
        // =============================================
        const scores = [

            strokeControl.score,
            movementFluency.score,
            workspace.score,
            writingEfficiency.score,

        ];

        const highest = Math.max(...scores);
        const lowest = Math.min(...scores);
        const spread = highest - lowest;

        const confidence = Math.max(
            70,
            Number((100 - spread).toFixed(2))

        );

        return {
            overallScore,
            severity,
            confidence,

            evaluatorScores: {
                strokeControl: strokeControl.score,
                movementFluency: movementFluency.score,
                workspace: workspace.score,
                writingEfficiency: writingEfficiency.score,

            },
        };
    },
};

export default SeverityClassifier;