const StrokeNormalizer =
    require("./StrokeNormalizer");

const ReferenceFitAnalyzer =
    require("./ReferenceFitAnalyzer");


class SpacingAnalyzer {

    static analyze(data = {}) {

        const {
            attempts = [],
            samples = [],
        } = data;

        const results = [];

        samples.forEach((sample, index) => {

            if (!sample) return;

            let rawStrokes =
                sample.stroke_json;

            if (typeof rawStrokes === "string") {
                try {
                    rawStrokes =
                        JSON.parse(rawStrokes);
                } catch {
                    rawStrokes = [];
                }
            }

            if (
                !Array.isArray(rawStrokes) ||
                !rawStrokes.length
            ) {
                return;
            }

            const attempt =
                attempts[index] || {};

            const word =
                String(
                    attempt.prompt_text ||
                    attempt.activity_name ||
                    ""
                )
                .trim()
                .replace(/\s+/g, "");

            const expectedLetters =
                word.length;

            if (expectedLetters < 2) {
                return;
            }

            const strokes =
                StrokeNormalizer.normalize(
                    rawStrokes
                );

            if (!strokes.length) {
                return;
            }

            // ==================================================
            // PRIMARY:
            // ACTUAL STUDENT IMAGE vs ACTUAL GUIDE IMAGE
            // ==================================================

            const referenceFit =
                ReferenceFitAnalyzer.analyze({

                    samples: [sample],

                    options: {

                        preserveCanvasPosition: true,

                        studentThreshold: 120,

                        referenceThreshold: 245,

                        toleranceRadius: 16,

                        maxDistance: 30,

                    },

                });

            const referenceResult =
                referenceFit
                    ?.attemptDetails?.[0];

            const referenceScore =
                Number(
                    referenceResult?.score || 0
                );


            // ==================================================
            // SECONDARY:
            // SPACING GEOMETRY
            // ==================================================

            const guide =
                this.getGuideMetrics(sample);

            const guideBoxes =
                Array.isArray(
                    guide?.letterBoxes
                )
                    ? guide.letterBoxes
                        .filter(
                            box =>
                                box &&
                                Number.isFinite(
                                    Number(
                                        box.centerX
                                    )
                                )
                        )
                        .sort(
                            (a, b) =>
                                Number(a.centerX) -
                                Number(b.centerX)
                        )
                        .slice(
                            0,
                            expectedLetters
                        )
                    : [];

            if (
                guideBoxes.length <
                expectedLetters
            ) {

                results.push({

                    attemptIndex: index,

                    word,

                    score:
                        referenceScore,

                    referenceScore,

                    spacingScore:
                        0,

                    valid:
                        referenceResult?.valid === true,

                    reason:
                        "Guide letter spacing metrics are missing.",

                });

                return;
            }


            // ==================================================
            // Assign strokes to guide letters
            // ==================================================

            const assigned =
                guideBoxes.map(
                    () => []
                );

            strokes.forEach(stroke => {

                if (!stroke.length) return;

                const centerX =
                    this.strokeCenterX(
                        stroke
                    );

                let closest =
                    0;

                let distance =
                    Infinity;

                guideBoxes.forEach(
                    (box, boxIndex) => {

                        const d =
                            Math.abs(
                                centerX -
                                Number(
                                    box.centerX
                                )
                            );

                        if (
                            d < distance
                        ) {

                            distance = d;

                            closest =
                                boxIndex;

                        }

                    }
                );

                assigned[closest].push(
                    stroke
                );

            });


            const studentLetters =
                assigned.map(
                    (letterStrokes, letterIndex) => {

                        const points =
                            letterStrokes.flat();

                        if (!points.length) {
                            return null;
                        }

                        const xs =
                            points.map(
                                p => Number(p.x)
                            );

                        const ys =
                            points.map(
                                p => Number(p.y)
                            );

                        const minX =
                            Math.min(...xs);

                        const maxX =
                            Math.max(...xs);

                        const minY =
                            Math.min(...ys);

                        const maxY =
                            Math.max(...ys);

                        return {

                            letterIndex,

                            minX,

                            maxX,

                            minY,

                            maxY,

                            width:
                                maxX - minX,

                            height:
                                maxY - minY,

                            centerX:
                                (
                                    minX +
                                    maxX
                                ) / 2,

                        };

                    }
                );


            const detectedLetters =
                studentLetters.filter(
                    Boolean
                ).length;


            if (
                detectedLetters < 2
            ) {

                results.push({

                    attemptIndex: index,

                    word,

                    expectedLetters,

                    detectedLetters,

                    score:
                        referenceScore * 0.75,

                    referenceScore,

                    spacingScore:
                        0,

                    valid:
                        referenceResult?.valid === true,

                    reason:
                        "Not enough student letters detected.",

                });

                return;
            }


            // ==================================================
            // Calculate student/reference gaps
            // ==================================================

            const studentGaps = [];

            const referenceGaps = [];

            const gapScores = [];


            for (
                let i = 1;
                i < expectedLetters;
                i++
            ) {

                const previousStudent =
                    studentLetters[i - 1];

                const currentStudent =
                    studentLetters[i];

                const previousGuide =
                    guideBoxes[i - 1];

                const currentGuide =
                    guideBoxes[i];


                if (
                    previousStudent &&
                    currentStudent
                ) {

                    studentGaps.push(

                        currentStudent.minX -
                        previousStudent.maxX

                    );

                }


                const guideGap =

                    Number(
                        currentGuide.left
                    ) -
                    Number(
                        previousGuide.right
                    );


                referenceGaps.push(
                    guideGap
                );

            }


            for (
                let i = 0;
                i < studentGaps.length;
                i++
            ) {

                const studentGap =
                    studentGaps[i];

                const referenceGap =
                    referenceGaps[i];


                const tolerance =

                    Math.max(

                        20,

                        Math.abs(
                            referenceGap
                        ) * 0.35

                    );


                const error =

                    Math.abs(
                        studentGap -
                        referenceGap
                    ) /
                    tolerance;


                gapScores.push(

                    this.errorScore(
                        error,
                        1,
                        3
                    )

                );

            }


            const averageGap =
                this.average(
                    studentGaps
                );


            const gapDeviation =
                this.standardDeviation(
                    studentGaps
                );


            const coefficientVariation =

                gapDeviation /
                Math.max(
                    20,
                    Math.abs(
                        averageGap
                    )
                );


            const gapAccuracy =

                gapScores.length
                    ? this.average(
                        gapScores
                    )
                    : 0;


            const consistency =

                this.consistencyScore(
                    coefficientVariation
                );


            const spacingScore =

                (
                    gapAccuracy *
                    0.70
                ) +

                (
                    consistency *
                    0.30
                );


            // ==================================================
            // FINAL
            //
            // IMAGE MATCH       75%
            // SPACING ANALYSIS  25%
            // ==================================================

            const score =

                (
                    referenceScore *
                    0.75
                ) +

                (
                    spacingScore *
                    0.25
                );


            results.push({

                attemptIndex: index,

                word,

                expectedLetters,

                detectedLetters,

                score:
                    Number(
                        score.toFixed(2)
                    ),

                referenceScore,

                spacingScore,

                gapAccuracy,

                consistency,

                averageGap,

                gapDeviation,

                coefficientVariation,

                gaps:
                    studentGaps,

                referenceGaps,

                referenceFit,

                valid:
                    true,

            });

        });


        const valid =
            results.filter(
                result =>
                    result.valid
            );


        const score =
            valid.length
                ? this.average(
                    valid.map(
                        result =>
                            result.score
                    )
                )
                : 0;


        return {

            score:
                Number(
                    score.toFixed(2)
                ),

            classification:
                this.classify(score),

            attemptsAnalyzed:
                valid.length,

            referenceScore:
                Number(
                    this.average(
                        valid.map(
                            result =>
                                result.referenceScore
                        )
                    ).toFixed(2)
                ),

            spacingScore:
                Number(
                    this.average(
                        valid.map(
                            result =>
                                result.spacingScore
                        )
                    ).toFixed(2)
                ),

            averageSpacing:
                Number(
                    this.average(
                        valid.flatMap(
                            result =>
                                result.gaps || []
                        )
                    ).toFixed(2)
                ),

            spacingDeviation:
                Number(
                    this.average(
                        valid.map(
                            result =>
                                result.gapDeviation || 0
                        )
                    ).toFixed(2)
                ),

            spacingDistances:
                valid.flatMap(
                    result =>
                        result.gaps || []
                ),

            wordScores:
                valid.map(
                    result =>
                        Number(
                            result.score.toFixed(2)
                        )
                ),

            wordDetails:
                results,

            attemptDetails:
                results,

        };

    }


    static getGuideMetrics(sample) {

        let guide =
            sample?.guide_json;

        if (
            typeof guide === "string"
        ) {

            try {
                guide =
                    JSON.parse(guide);
            } catch {
                guide = null;
            }

        }

        return (
            guide?.metrics ||
            guide ||
            null
        );

    }


    static strokeCenterX(stroke) {

        if (
            !Array.isArray(stroke) ||
            !stroke.length
        ) {
            return 0;
        }

        const xs =
            stroke
                .map(
                    point =>
                        Number(point?.x)
                )
                .filter(
                    Number.isFinite
                );

        return xs.length
            ? this.average(xs)
            : 0;

    }


    static errorScore(
        error,
        good,
        severe
    ) {

        if (
            !Number.isFinite(error)
        ) {
            return 0;
        }

        if (
            error <= good
        ) {
            return 100;
        }

        if (
            error >= severe
        ) {
            return 0;
        }

        const ratio =

            (
                error -
                good
            ) /
            (
                severe -
                good
            );

        return Math.max(
            0,
            100 *
            (
                1 -
                Math.pow(
                    ratio,
                    1.2
                )
            )
        );

    }


    static consistencyScore(cv) {

        if (
            !Number.isFinite(cv)
        ) {
            return 0;
        }

        if (
            cv <= 0.12
        ) {
            return 100;
        }

        if (
            cv >= 1
        ) {
            return 20;
        }

        return Math.max(
            20,
            100 *
            Math.exp(
                -1.35 * cv
            )
        );

    }


    static standardDeviation(values) {

        if (!values.length) {
            return 0;
        }

        const avg =
            this.average(values);

        return Math.sqrt(

            this.average(

                values.map(
                    value =>
                        Math.pow(
                            value - avg,
                            2
                        )
                )

            )

        );

    }


    static average(values) {

        if (
            !Array.isArray(values) ||
            !values.length
        ) {
            return 0;
        }

        return (

            values.reduce(
                (
                    sum,
                    value
                ) =>
                    sum +
                    (
                        Number(value) ||
                        0
                    ),
                0
            ) /
            values.length

        );

    }


    static classify(score) {

        if (score >= 90) {
            return "Excellent";
        }

        if (score >= 80) {
            return "Good";
        }

        if (score >= 70) {
            return "Fair";
        }

        if (score >= 60) {
            return "Needs Improvement";
        }

        return "Poor";

    }

}


module.exports =
    SpacingAnalyzer;