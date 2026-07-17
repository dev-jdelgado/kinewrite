const StrokeNormalizer =
    require("./handwriting/StrokeNormalizer");

const FeatureExtractor =
    require("./handwriting/FeatureExtractor");

const StrokeCluster =
    require("./handwriting/StrokeCluster");

const LetterSegmenter =
    require("./handwriting/LetterSegmenter");

const SpacingAnalyzer =
    require("./handwriting/SpacingAnalyzer");

const AlignmentAnalyzer =
    require("./handwriting/AlignmentAnalyzer");

const StrokeAnalyzer =
    require("./handwriting/StrokeAnalyzer");

const ScoreCalculator =
    require("./handwriting/ScoreCalculator");

class HandwritingAnalyzer {

    // ==========================================
    // Analyze Handwriting
    // ==========================================

    static analyze(strokes, options = {}) {

        if (
            !Array.isArray(strokes) ||
            strokes.length === 0
        ) {

            throw new Error(
                "No handwriting strokes found."
            );

        }

        const {

            expectedLetters = null,

            prompt = null,

        } = options;

        // ==========================================
        // Step 1
        // Normalize
        // ==========================================

        const normalizedStrokes =
            StrokeNormalizer.normalize(strokes);

        if (normalizedStrokes.length === 0) {

            throw new Error(
                "No valid handwriting strokes found."
            );

        }

        // ==========================================
        // Step 2
        // Extract Global Features
        // ==========================================

        const features =
            FeatureExtractor.extract(
                normalizedStrokes
            );

        // ==========================================
        // Step 3
        // Cluster Strokes
        // ==========================================

        const clusters =
            StrokeCluster.cluster(
                normalizedStrokes
            );

        // ==========================================
        // Step 4
        // Segment Letters
        // ==========================================

        const letters =
            LetterSegmenter.segment(

                normalizedStrokes,

                expectedLetters

            );

        // ==========================================
        // Step 5
        // Analyze
        // ==========================================

        // For now the analyzers still use
        // normalized strokes.

        // Later they can be upgraded
        // to consume letters.

        const spacing =
            SpacingAnalyzer.analyze(
                normalizedStrokes
            );

        const alignment =
            AlignmentAnalyzer.analyze(
                normalizedStrokes
            );

        const stroke =
            StrokeAnalyzer.analyze(
                normalizedStrokes
            );

        // ==========================================
        // Step 6
        // Overall Score
        // ==========================================

        const finalResult =
            ScoreCalculator.calculate({

                spacing,

                alignment,

                stroke,

            });

        // ==========================================
        // Return
        // ==========================================

        return {

            prompt,

            expectedLetters,

            strokeCount:
                normalizedStrokes.length,

            clusterCount:
                clusters.length,

            letterCount:
                letters.length,

            features,

            clusters,

            letters,

            spacing,

            alignment,

            stroke,

            ...finalResult,

        };

    }

}

module.exports = HandwritingAnalyzer;