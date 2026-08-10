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


class HandwritingAnalyzer {

    // ==========================================
    // Analyze Category
    // ==========================================

    static analyze(

        categoryData,

        options = {}

    ) {

        const {

            attempts = [],

            samples = [],

            strokes = [],

        } = categoryData;

        // ==========================================
        // Validate
        // ==========================================

        if (

            !Array.isArray(strokes) ||

            strokes.length === 0

        ) {

            throw new Error(

                "No handwriting strokes found."

            );

        }

        const {

            category,

        } = options;

        const normalizedCategory =

            String(category || "")

                .trim()

                .toLowerCase();

        if (

            ![

                "alignment",

                "spacing",

                "stroke",

            ].includes(

                normalizedCategory

            )

        ) {

            throw new Error(

                `Unknown analysis category: ${category}`

            );

        }

        // ==========================================
        // Step 1
        // Normalize
        // ==========================================

        const normalizedStrokes =

            StrokeNormalizer.normalize(

                strokes

            );

        if (

            normalizedStrokes.length === 0

        ) {

            throw new Error(

                "No valid handwriting strokes found."

            );

        }

        // ==========================================
        // Step 2
        // Extract Features
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

        const expectedLetters =

            options.expectedLetters ??

            null;

        const letters =

            LetterSegmenter.segment(

                normalizedStrokes,

                expectedLetters

            );

        // ==========================================
        // Step 5
        // Analyze Category
        // ==========================================

        const analyzerData = {

            attempts,

            samples,

            strokes:
                normalizedStrokes,

            features,

            clusters,

            letters,

        };

        let metrics;

        switch (

            normalizedCategory

        ) {

            case "alignment":

                metrics =

                    AlignmentAnalyzer.analyze(

                        analyzerData

                    );

                break;

            case "spacing":

                metrics =

                    SpacingAnalyzer.analyze(

                        analyzerData

                    );

                break;

            case "stroke":

                metrics =

                    StrokeAnalyzer.analyze(

                        analyzerData

                    );

                break;

        }

        // ==========================================
        // Return
        // ==========================================

        return {

            category:
                normalizedCategory,

            attempts,

            samples,

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

            score:
                metrics?.score ?? 0,

            metrics,

        };

    }

}


module.exports = HandwritingAnalyzer;