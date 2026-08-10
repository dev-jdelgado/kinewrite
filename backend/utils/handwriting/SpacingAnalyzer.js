const StrokeNormalizer =
    require("./StrokeNormalizer");

const LetterSegmenter =
    require("./LetterSegmenter");


class SpacingAnalyzer {

    // ==========================================
    // Analyze Spacing V4
    // ==========================================

    static analyze(data) {

        const {

            attempts = [],

            samples = [],

        } = data || {};


        // ==========================================
        // No Samples
        // ==========================================

        if (
            !Array.isArray(samples) ||
            samples.length === 0
        ) {

            return {

                score: 0,

                averageSpacing: 0,

                spacingVariance: 0,

                spacingDeviation: 0,

                wordScores: [],

                spacingDistances: [],

                attemptsAnalyzed: 0,

            };

        }


        // ==========================================
        // Analyze Each Word Separately
        //
        // CAT
        // DOG
        // PEN
        // SUN
        // BOOK
        // ==========================================

        const wordResults = [];


        samples.forEach((sample, index) => {

            if (!sample) {
                return;
            }


            // --------------------------------------
            // Get Strokes
            // --------------------------------------

            let rawStrokes =
                sample.stroke_json;


            if (
                typeof rawStrokes === "string"
            ) {

                try {

                    rawStrokes =
                        JSON.parse(rawStrokes);

                } catch (error) {

                    rawStrokes = [];

                }

            }


            if (
                !Array.isArray(rawStrokes) ||
                rawStrokes.length === 0
            ) {

                return;

            }


            // --------------------------------------
            // Get Word
            // --------------------------------------

            const attempt =
                Array.isArray(attempts)
                    ? attempts[index]
                    : null;


            const word =
                String(

                    attempt?.prompt_text ||

                    attempt?.activity_name ||

                    ""

                )
                    .trim()
                    .replace(
                        /\s+/g,
                        ""
                    );


            if (!word) {
                return;
            }


            // --------------------------------------
            // Expected Letter Count
            // --------------------------------------

            const expectedLetters =
                word.length;


            if (
                expectedLetters < 2
            ) {

                return;

            }


            // --------------------------------------
            // Normalize Strokes
            // --------------------------------------

            const normalizedStrokes =
                StrokeNormalizer.normalize(
                    rawStrokes
                );


            if (
                normalizedStrokes.length === 0
            ) {

                return;

            }


            // --------------------------------------
            // Segment Into Letters
            // --------------------------------------

            const letters =
                LetterSegmenter.segment(

                    normalizedStrokes,

                    expectedLetters

                );


            // --------------------------------------
            // Sort Left To Right
            // --------------------------------------

            const sortedLetters =
                [...letters]

                    .filter(letter =>
                        letter &&
                        letter.boundingBox
                    )

                    .sort(
                        (a, b) =>
                            a.centerX - b.centerX
                    );


            // --------------------------------------
            // Not Enough Letters
            // --------------------------------------

            if (
                sortedLetters.length < 2
            ) {

                wordResults.push({

                    attemptIndex: index,

                    word,

                    expectedLetters,

                    detectedLetters:
                        sortedLetters.length,

                    score: 0,

                    gaps: [],

                    normalizedGaps: [],

                    averageGap: 0,

                    gapDeviation: 0,

                    coefficientVariation: 1,

                    overlapCount: 0,

                    compressedCount: 0,

                    valid: false,

                });

                return;

            }


            // --------------------------------------
            // Compute Gaps
            // --------------------------------------

            const gaps = [];


            for (
                let i = 1;
                i < sortedLetters.length;
                i++
            ) {

                const previous =
                    sortedLetters[i - 1];

                const current =
                    sortedLetters[i];


                const previousMaxX =
                    previous.boundingBox.maxX;


                const currentMinX =
                    current.boundingBox.minX;


                const gap =
                    currentMinX -
                    previousMaxX;


                gaps.push(gap);

            }


            if (gaps.length === 0) {
                return;
            }


            // --------------------------------------
            // Average Letter Width
            // --------------------------------------

            const widths =
                sortedLetters

                    .map(letter =>
                        this.getWidth(letter)
                    )

                    .filter(
                        width =>
                            width > 0
                    );


            const averageWidth =

                widths.length > 0

                    ? widths.reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    ) /
                    widths.length

                    : 100;


            // --------------------------------------
            // Average Gap
            // --------------------------------------

            const averageGap =

                gaps.reduce(
                    (sum, value) =>
                        sum + value,
                    0
                ) /
                gaps.length;


            // --------------------------------------
            // Gap Variance
            // --------------------------------------

            const variance =

                gaps.reduce(
                    (sum, gap) => {

                        return sum +

                            Math.pow(
                                gap -
                                averageGap,
                                2
                            );

                    },
                    0
                ) /
                gaps.length;


            const gapDeviation =
                Math.sqrt(variance);


            // --------------------------------------
            // Coefficient Of Variation
            //
            // This makes the scoring relative to
            // the word rather than raw pixels.
            // --------------------------------------

            const positiveAverageGap =
                Math.max(
                    1,
                    Math.abs(averageGap)
                );


            const coefficientVariation =

                gapDeviation /
                positiveAverageGap;


            // --------------------------------------
            // Gap Consistency Score
            //
            // Perfectly even gaps approach 100.
            // --------------------------------------

            let consistencyScore =

                100 *
                Math.exp(
                    -1.5 *
                    coefficientVariation
                );


            consistencyScore =
                Math.max(
                    0,
                    Math.min(
                        100,
                        consistencyScore
                    )
                );


            // --------------------------------------
            // Overlap Detection
            // --------------------------------------

            const overlapCount =
                gaps.filter(
                    gap =>
                        gap < 0
                ).length;


            // --------------------------------------
            // Compressed Spacing
            //
            // A gap smaller than 5% of average
            // letter width is considered too tight.
            // --------------------------------------

            const minimumReasonableGap =
                Math.max(
                    3,
                    averageWidth * 0.05
                );


            const compressedCount =
                gaps.filter(
                    gap =>
                        gap >= 0 &&
                        gap < minimumReasonableGap
                ).length;


            // --------------------------------------
            // Spacing Presence Score
            // --------------------------------------

            const totalGaps =
                gaps.length;


            const positiveGapCount =
                gaps.filter(
                    gap =>
                        gap >= minimumReasonableGap
                ).length;


            let spacingPresenceScore =

                (
                    positiveGapCount /
                    totalGaps
                ) * 100;


            // --------------------------------------
            // Overlap Penalty
            // --------------------------------------

            if (
                overlapCount > 0
            ) {

                const overlapRatio =
                    overlapCount /
                    totalGaps;


                spacingPresenceScore *=

                    Math.max(
                        0,
                        1 -
                        (
                            overlapRatio *
                            0.75
                        )
                    );

            }


            // --------------------------------------
            // Final Word Score
            //
            // 70% = consistency
            // 30% = actual spacing
            // --------------------------------------

            let wordScore =

                (
                    consistencyScore *
                    0.70
                ) +

                (
                    spacingPresenceScore *
                    0.30
                );


            // --------------------------------------
            // Additional compression penalty
            // --------------------------------------

            if (
                compressedCount > 0
            ) {

                const compressionRatio =

                    compressedCount /
                    totalGaps;


                wordScore *=

                    Math.max(
                        0.70,
                        1 -
                        (
                            compressionRatio *
                            0.30
                        )
                    );

            }


            // --------------------------------------
            // Clamp
            // --------------------------------------

            wordScore =
                Math.max(
                    0,
                    Math.min(
                        100,
                        wordScore
                    )
                );


            // --------------------------------------
            // Normalized Gaps
            // --------------------------------------

            const normalizedGaps =
                gaps.map(
                    gap =>
                        gap /
                        averageWidth
                );


            // --------------------------------------
            // Save Result
            // --------------------------------------

            wordResults.push({

                attemptIndex: index,

                word,

                expectedLetters,

                detectedLetters:
                    sortedLetters.length,

                score: wordScore,

                gaps,

                normalizedGaps,

                averageGap,

                gapDeviation,

                coefficientVariation,

                averageLetterWidth:
                    averageWidth,

                overlapCount,

                compressedCount,

                valid: true,

            });

        });


        // ==========================================
        // Valid Words
        // ==========================================

        const validWords =
            wordResults.filter(
                result =>
                    result.valid
            );


        if (
            validWords.length === 0
        ) {

            return {

                score: 0,

                averageSpacing: 0,

                spacingVariance: 0,

                spacingDeviation: 0,

                wordScores: [],

                spacingDistances: [],

                attemptsAnalyzed: 0,

            };

        }


        // ==========================================
        // Word Scores
        // ==========================================

        const wordScores =
            validWords.map(
                result =>
                    result.score
            );


        // ==========================================
        // Final Spacing Score
        // ==========================================

        const finalScore =

            wordScores.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) /
            wordScores.length;


        // ==========================================
        // All Gaps
        // ==========================================

        const allGaps = [];

        validWords.forEach(result => {

            allGaps.push(
                ...result.gaps
            );

        });


        // ==========================================
        // Average Spacing
        // ==========================================

        const averageSpacing =

            allGaps.length > 0

                ? allGaps.reduce(
                    (sum, value) =>
                        sum + value,
                    0
                ) /
                allGaps.length

                : 0;


        // ==========================================
        // Overall Variance
        // ==========================================

        const spacingVariance =

            allGaps.length > 0

                ? allGaps.reduce(
                    (sum, gap) => {

                        return sum +

                            Math.pow(
                                gap -
                                averageSpacing,
                                2
                            );

                    },
                    0
                ) /
                allGaps.length

                : 0;


        const spacingDeviation =
            Math.sqrt(
                spacingVariance
            );


        // ==========================================
        // Return
        // ==========================================

        return {

            score: Number(
                finalScore.toFixed(2)
            ),

            averageSpacing: Number(
                averageSpacing.toFixed(2)
            ),

            spacingVariance: Number(
                spacingVariance.toFixed(2)
            ),

            spacingDeviation: Number(
                spacingDeviation.toFixed(2)
            ),

            spacingDistances:
                allGaps.map(
                    value =>
                        Number(
                            value.toFixed(2)
                        )
                ),

            wordScores:
                wordScores.map(
                    value =>
                        Number(
                            value.toFixed(2)
                        )
                ),

            attemptsAnalyzed:
                validWords.length,

            wordDetails:
                validWords.map(
                    result => ({

                        attemptIndex:
                            result.attemptIndex,

                        word:
                            result.word,

                        expectedLetters:
                            result.expectedLetters,

                        detectedLetters:
                            result.detectedLetters,

                        score:
                            Number(
                                result.score.toFixed(2)
                            ),

                        averageGap:
                            Number(
                                result.averageGap.toFixed(2)
                            ),

                        gapDeviation:
                            Number(
                                result.gapDeviation.toFixed(2)
                            ),

                        coefficientVariation:
                            Number(
                                result.coefficientVariation.toFixed(4)
                            ),

                        averageLetterWidth:
                            Number(
                                result.averageLetterWidth.toFixed(2)
                            ),

                        overlapCount:
                            result.overlapCount,

                        compressedCount:
                            result.compressedCount,

                        gaps:
                            result.gaps.map(
                                value =>
                                    Number(
                                        value.toFixed(2)
                                    )
                            ),

                        normalizedGaps:
                            result.normalizedGaps.map(
                                value =>
                                    Number(
                                        value.toFixed(4)
                                    )
                            ),

                    })
                ),

        };

    }


    // ==========================================
    // Get Letter Width
    // ==========================================

    static getWidth(letter) {

        if (
            letter &&
            typeof letter.width === "number" &&
            Number.isFinite(letter.width) &&
            letter.width > 0
        ) {

            return letter.width;

        }


        if (
            letter &&
            letter.boundingBox &&
            typeof letter.boundingBox.width === "number"
        ) {

            return letter.boundingBox.width;

        }


        if (
            letter &&
            letter.boundingBox &&
            typeof letter.boundingBox.minX === "number" &&
            typeof letter.boundingBox.maxX === "number"
        ) {

            return (
                letter.boundingBox.maxX -
                letter.boundingBox.minX
            );

        }


        return 0;

    }

}


module.exports = SpacingAnalyzer;