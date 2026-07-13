// ======================================================
// SummaryGenerator
// Generates a professional assessment summary based on
// handwriting evaluation results.
// ======================================================

const SummaryGenerator = {

    generate({
        classification,
        therapyRecommendation,
        strokeControl,
        movementFluency,
        workspace,
        writingEfficiency,
    }) {

        const strengths = [];
        const improvements = [];

        // =============================================
        // Stroke Control
        // =============================================
        if (strokeControl.score >= 80) {
            strengths.push("stroke control");
        } else {
            improvements.push("stroke control");
        }

        // =============================================
        // Movement Fluency
        // =============================================
        if (movementFluency.score >= 80) {
            strengths.push("movement fluency");
        } else {
            improvements.push("movement fluency");
        }

        // =============================================
        // Workspace
        // =============================================
        if (workspace.score >= 80) {
            strengths.push("workspace organization");
        } else {
            improvements.push("workspace organization");
        }

        // =============================================
        // Writing Efficiency
        // =============================================
        if (writingEfficiency.score >= 80) {
            strengths.push("writing efficiency");
        } else {
            improvements.push("writing efficiency");
        }

        // =============================================
        // Summary
        // =============================================
        let summary =
            `The handwriting assessment indicates ${classification.severity.toLowerCase()} with an overall performance score of ${classification.overallScore}%. `;

        if (strengths.length > 0) {
            summary +=
                `The student demonstrated strengths in ${strengths.join(", ")}. `;
        }

        if (improvements.length > 0) {
            summary +=
                `Additional intervention is recommended for ${improvements.join(", ")}. `;

        }
        summary += therapyRecommendation.recommendation;

        return summary;
    },
};

export default SummaryGenerator;