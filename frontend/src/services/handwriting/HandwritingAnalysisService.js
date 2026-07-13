// ======================================================
// HandwritingAnalysisService
// Main Orchestrator for the KineWrite
// Handwriting Analysis Engine.
// ======================================================

import StrokeMetrics from "./metrics/StrokeMetrics";
import TimeMetrics from "./metrics/TimeMetrics";
import DistanceMetrics from "./metrics/DistanceMetrics";
import BoundingBoxMetrics from "./metrics/BoundingBoxMetrics";

import StrokeControlEvaluator from "./evaluators/StrokeControlEvaluator";
import MovementFluencyEvaluator from "./evaluators/MovementFluencyEvaluator";
import WorkspaceEvaluator from "./evaluators/WorkspaceEvaluator";
import WritingEfficiencyEvaluator from "./evaluators/WritingEfficiencyEvaluator";

import SeverityClassifier from "./classifiers/SeverityClassifier";
import TherapyRecommendation from "./classifiers/TherapyRecommendation";
import SummaryGenerator from "./classifiers/SummaryGenerator";

const HandwritingAnalysisService = {

    // ==================================================
    // Main Pipeline
    // ==================================================

    async analyzeHandwriting(handwritingData, handwritingImage = null) {

        this.validate(handwritingData);

        // Simulate processing (remove once backend exists)
        await new Promise((resolve) =>
            setTimeout(resolve, 1500)
        );

        // =============================================
        // Metrics Layer
        // =============================================

        const strokeMetrics =
            StrokeMetrics.calculate(handwritingData);

        const timeMetrics =
            TimeMetrics.calculate(handwritingData);

        const distanceMetrics =
            DistanceMetrics.calculate(handwritingData);

        const boundingBoxMetrics =
            BoundingBoxMetrics.calculate(handwritingData);

        // =============================================
        // Evaluation Layer
        // =============================================

        const strokeControl =
            StrokeControlEvaluator.evaluate(
                strokeMetrics
            );

        const movementFluency =
            MovementFluencyEvaluator.evaluate(
                distanceMetrics,
                timeMetrics
            );

        const workspace =
            WorkspaceEvaluator.evaluate(
                boundingBoxMetrics
            );

        const writingEfficiency =
            WritingEfficiencyEvaluator.evaluate(
                strokeMetrics,
                timeMetrics,
                distanceMetrics
            );

        // =============================================
        // Classification Layer
        // =============================================
        const classification =
            SeverityClassifier.classify({
                strokeControl,
                movementFluency,
                workspace,
                writingEfficiency,
            });

        const therapyRecommendation =
            TherapyRecommendation.generate(
                classification
            );

        const summary =
            SummaryGenerator.generate({
                classification,
                therapyRecommendation,
                strokeControl,
                movementFluency,
                workspace,
                writingEfficiency,
            });

        // =============================================
        // Final Result
        // =============================================

        return {

            generatedAt: new Date().toISOString(),

            handwritingImage,

            metrics: {
                strokeMetrics,
                timeMetrics,
                distanceMetrics,
                boundingBoxMetrics,
            },

            evaluations: {
                strokeControl,
                movementFluency,
                workspace,
                writingEfficiency,
            },

            classification,
            therapyRecommendation,
            summary,
        };
    },

    // ==================================================
    // Validation
    // ==================================================
    validate(handwritingData) {

        if (!Array.isArray(handwritingData)) {
            throw new Error(
                "Invalid handwriting data."
            );
        }

        if (handwritingData.length === 0) {
            throw new Error(
                "No handwriting sample found."
            );
        }
    },

};

export default HandwritingAnalysisService;