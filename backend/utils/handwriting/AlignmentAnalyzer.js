const StrokeNormalizer =
    require("./StrokeNormalizer");

const LetterSegmenter =
    require("./LetterSegmenter");

const ReferenceGeometry =
    require("./ReferenceGeometry");


class AlignmentAnalyzer {

    // ==========================================================
    // Alignment Analyzer V6
    // ==========================================================
    //
    // Activities:
    //
    // 1. A a
    // 2. B b
    // 3. C c
    // 4. D d
    // 5. E e
    //
    // Scoring:
    //
    // Baseline            40%
    // Letter Position     25%
    // Vertical Placement  15%
    // Letter Height       10%
    // Internal Consistency 10%
    //
    // ReferenceGeometry supplies expected normalized
    // letter positions.
    //
    // The actual worksheet guide supplies the real
    // baseline and writing bounds.
    // ==========================================================


    static analyze(data) {

        const {
            samples = [],
        } = data || {};


        // ======================================================
        // Validate Samples
        // ======================================================

        if (
            !Array.isArray(samples) ||
            samples.length === 0
        ) {

            return this.emptyResult();

        }


        const attemptResults = [];


        // ======================================================
        // Analyze Each Sample
        // ======================================================

        samples.forEach((sample, index) => {

            if (!sample) {
                return;
            }


            // ==================================================
            // Get Raw Strokes
            // ==================================================

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

                attemptResults.push({

                    attemptIndex:
                        index,

                    score: 0,

                    valid: false,

                    reason:
                        "No handwriting strokes found.",

                });

                return;

            }


            // ==================================================
            // Normalize Student Strokes
            // ==================================================

            const normalizedStrokes =
                StrokeNormalizer.normalize(
                    rawStrokes
                );


            if (
                !Array.isArray(normalizedStrokes) ||
                normalizedStrokes.length === 0
            ) {

                attemptResults.push({

                    attemptIndex:
                        index,

                    score: 0,

                    valid: false,

                    reason:
                        "Could not normalize handwriting strokes.",

                });

                return;

            }


            // ==================================================
            // Segment Two Letters
            // ==================================================

            const letters =
                LetterSegmenter.segment(

                    normalizedStrokes,

                    2

                );


            if (
                !Array.isArray(letters)
            ) {

                attemptResults.push({

                    attemptIndex:
                        index,

                    score: 0,

                    valid: false,

                    reason:
                        "Letter segmentation failed.",

                });

                return;

            }


            // ==================================================
            // Sort Letters Left → Right
            // ==================================================

            const sortedLetters =

                letters

                    .filter(letter =>

                        letter &&

                        letter.boundingBox

                    )

                    .sort(

                        (a, b) =>

                            this.getCenterX(a) -
                            this.getCenterX(b)

                    );


            if (
                sortedLetters.length < 2
            ) {

                attemptResults.push({

                    attemptIndex:
                        index,

                    score: 0,

                    valid: false,

                    reason:
                        "Could not detect two letters.",

                });

                return;

            }


            const leftLetter =
                sortedLetters[0];

            const rightLetter =
                sortedLetters[1];


            // ==================================================
            // Guide Data
            // ==================================================

            const guideData =
                this.getGuideData(sample);


            const worksheetWidth =
                this.getWorksheetWidth(
                    guideData
                ) || 1000;


            const worksheetHeight =
                this.getWorksheetHeight(
                    guideData
                ) || 600;


            const guideBounds =
                this.getGuideBounds(
                    guideData
                );


            const guideBaseline =
                this.getGuideBaseline(
                    guideData
                );


            // ==================================================
            // Determine Activity / Prompt
            // ==================================================

            const promptText =
                this.getPromptText(sample);


            const reference =
                ReferenceGeometry.getPixelAlignmentReference(

                    promptText,

                    worksheetWidth,

                    worksheetHeight

                );


            // ==================================================
            // Student Geometry
            // ==================================================

            const left =
                this.getLetterMetrics(
                    leftLetter
                );


            const right =
                this.getLetterMetrics(
                    rightLetter
                );


            if (
                !left ||
                !right
            ) {

                attemptResults.push({

                    attemptIndex:
                        index,

                    score: 0,

                    valid: false,

                    reason:
                        "Invalid letter geometry.",

                });

                return;

            }


            // ==================================================
            // Average Student Metrics
            // ==================================================

            const averageHeight =

                (
                    left.height +
                    right.height
                ) / 2;


            const studentBaseline =

                (
                    left.baseline +
                    right.baseline
                ) / 2;


            const studentCenterY =

                (
                    left.centerY +
                    right.centerY
                ) / 2;


            // ==================================================
            // 1. BASELINE SCORE
            // ==================================================

            let baselineScore = 100;

            let baselineDeviation = 0;

            let baselineTolerance =
                Math.max(
                    12,
                    worksheetHeight * 0.025
                );


            if (
                guideBaseline !== null
            ) {

                baselineDeviation =

                    Math.abs(

                        studentBaseline -
                        guideBaseline

                    );


                baselineScore =

                    this.deviationScore(

                        baselineDeviation,

                        baselineTolerance,

                        worksheetHeight * 0.16

                    );

            } else {

                // If no guide baseline exists,
                // compare the two letters.

                const internalBaselineDifference =

                    Math.abs(

                        left.baseline -
                        right.baseline

                    );


                baselineDeviation =
                    internalBaselineDifference;


                baselineScore =

                    this.deviationScore(

                        internalBaselineDifference,

                        Math.max(
                            10,
                            averageHeight * 0.08
                        ),

                        Math.max(
                            60,
                            averageHeight * 0.45
                        )

                    );

            }


            // ==================================================
            // 2. LETTER POSITION SCORE
            // ==================================================

            let horizontalScore = 100;

            let horizontalDeviation = 0;

            let expectedLeftX = null;

            let expectedRightX = null;


            if (
                reference
            ) {

                expectedLeftX =
                    reference.left.centerX;

                expectedRightX =
                    reference.right.centerX;


                const leftDeviation =

                    Math.abs(

                        left.centerX -
                        expectedLeftX

                    );


                const rightDeviation =

                    Math.abs(

                        right.centerX -
                        expectedRightX

                    );


                horizontalDeviation =

                    (
                        leftDeviation +
                        rightDeviation
                    ) / 2;


                const horizontalTolerance =

                    Math.max(

                        25,

                        worksheetWidth * 0.035

                    );


                horizontalScore =

                    this.deviationScore(

                        horizontalDeviation,

                        horizontalTolerance,

                        worksheetWidth * 0.18

                    );

            } else if (
                guideBounds
            ) {

                // Fallback when the prompt cannot be
                // identified in ReferenceGeometry.

                const guideWidth =
                    guideBounds.width;


                const expectedLeft =
                    guideBounds.left +
                    guideWidth * 0.25;


                const expectedRight =
                    guideBounds.left +
                    guideWidth * 0.75;


                const leftDeviation =

                    Math.abs(

                        left.centerX -
                        expectedLeft

                    );


                const rightDeviation =

                    Math.abs(

                        right.centerX -
                        expectedRight

                    );


                horizontalDeviation =

                    (
                        leftDeviation +
                        rightDeviation
                    ) / 2;


                horizontalScore =

                    this.deviationScore(

                        horizontalDeviation,

                        Math.max(
                            25,
                            guideWidth * 0.04
                        ),

                        guideWidth * 0.18

                    );

            }


            // ==================================================
            // 3. VERTICAL PLACEMENT SCORE
            // ==================================================
            //
            // The actual guide bounds are preferred over
            // hard-coded ReferenceGeometry vertical values.
            // ==================================================

            let verticalScore = 100;

            let verticalDeviation = 0;


            if (
                guideBounds
            ) {

                const guideCenterY =

                    (
                        guideBounds.top +
                        guideBounds.bottom
                    ) / 2;


                verticalDeviation =

                    Math.abs(

                        studentCenterY -
                        guideCenterY

                    );


                const verticalTolerance =

                    Math.max(

                        18,

                        guideBounds.height * 0.055

                    );


                verticalScore =

                    this.deviationScore(

                        verticalDeviation,

                        verticalTolerance,

                        guideBounds.height * 0.30

                    );

            } else if (
                reference
            ) {

                const expectedCenterY =

                    (
                        reference.left.centerY +
                        reference.right.centerY
                    ) / 2;


                verticalDeviation =

                    Math.abs(

                        studentCenterY -
                        expectedCenterY

                    );


                verticalScore =

                    this.deviationScore(

                        verticalDeviation,

                        worksheetHeight * 0.04,

                        worksheetHeight * 0.25

                    );

            }


            // ==================================================
            // 4. LETTER HEIGHT SCORE
            // ==================================================
            //
            // Compare the student's two letters against each
            // other and against the expected reference height
            // when available.
            // ==================================================

            const heightDifference =

                Math.abs(

                    left.height -
                    right.height

                );


            const relativeHeightDifference =

                averageHeight > 0

                    ? heightDifference /
                      averageHeight

                    : 1;


            let heightConsistencyScore =

                this.ratioScore(

                    relativeHeightDifference,

                    0.08,

                    0.30

                );


            let referenceHeightScore = 100;


            if (
                reference
            ) {

                const expectedHeight =

                    (
                        reference.left.height +
                        reference.right.height
                    ) / 2;


                const heightDeviation =

                    Math.abs(

                        averageHeight -
                        expectedHeight

                    );


                referenceHeightScore =

                    this.deviationScore(

                        heightDeviation,

                        worksheetHeight * 0.04,

                        worksheetHeight * 0.25

                    );

            }


            const heightScore =

                (
                    heightConsistencyScore * 0.50
                ) +

                (
                    referenceHeightScore * 0.50
                );


            // ==================================================
            // 5. INTERNAL CONSISTENCY
            // ==================================================

            const centerYDifference =

                Math.abs(

                    left.centerY -
                    right.centerY

                );


            const centerYConsistencyScore =

                this.deviationScore(

                    centerYDifference,

                    Math.max(
                        10,
                        averageHeight * 0.08
                    ),

                    Math.max(
                        60,
                        averageHeight * 0.40
                    )

                );


            const internalBaselineDifference =

                Math.abs(

                    left.baseline -
                    right.baseline

                );


            const baselineConsistencyScore =

                this.deviationScore(

                    internalBaselineDifference,

                    Math.max(
                        10,
                        averageHeight * 0.08
                    ),

                    Math.max(
                        60,
                        averageHeight * 0.40
                    )

                );


            const internalConsistencyScore =

                (
                    centerYConsistencyScore *
                    0.50
                ) +

                (
                    baselineConsistencyScore *
                    0.50
                );


            // ==================================================
            // FINAL SCORE
            // ==================================================
            //
            // Baseline             40%
            // Position             25%
            // Vertical placement   15%
            // Height               10%
            // Consistency          10%
            // ==================================================

            let exerciseScore =

                (
                    baselineScore *
                    0.40
                ) +

                (
                    horizontalScore *
                    0.25
                ) +

                (
                    verticalScore *
                    0.15
                ) +

                (
                    heightScore *
                    0.10
                ) +

                (
                    internalConsistencyScore *
                    0.10
                );


            exerciseScore =

                Math.max(

                    0,

                    Math.min(

                        100,

                        exerciseScore

                    )

                );


            // ==================================================
            // Alignment Flags
            // ==================================================

            const baselineAligned =

                baselineDeviation <=
                baselineTolerance;


            const goodHorizontalAlignment =

                horizontalScore >= 70;


            const goodVerticalAlignment =

                verticalScore >= 70;


            const aligned =

                baselineAligned &&

                goodHorizontalAlignment &&

                goodVerticalAlignment;


            // ==================================================
            // Save Attempt
            // ==================================================

            attemptResults.push({

                attemptIndex:
                    index,

                valid:
                    true,

                score:
                    exerciseScore,


                promptText,


                // ------------------------------------------
                // Student geometry
                // ------------------------------------------

                leftCenterX:
                    left.centerX,

                rightCenterX:
                    right.centerX,

                leftCenterY:
                    left.centerY,

                rightCenterY:
                    right.centerY,

                leftBaseline:
                    left.baseline,

                rightBaseline:
                    right.baseline,

                studentBaseline,

                studentCenterY,

                leftHeight:
                    left.height,

                rightHeight:
                    right.height,

                averageHeight,


                // ------------------------------------------
                // Reference geometry
                // ------------------------------------------

                expectedLeftX,

                expectedRightX,

                guideBaseline,

                guideTop:
                    guideBounds
                        ? guideBounds.top
                        : null,

                guideBottom:
                    guideBounds
                        ? guideBounds.bottom
                        : null,


                // ------------------------------------------
                // Baseline
                // ------------------------------------------

                baselineDeviation,

                baselineTolerance,

                baselineScore,


                // ------------------------------------------
                // Horizontal
                // ------------------------------------------

                horizontalDeviation,

                horizontalScore,


                // ------------------------------------------
                // Vertical
                // ------------------------------------------

                verticalDeviation,

                verticalScore,


                // ------------------------------------------
                // Height
                // ------------------------------------------

                heightDifference,

                heightScore,

                heightConsistencyScore,

                referenceHeightScore,


                // ------------------------------------------
                // Internal consistency
                // ------------------------------------------

                centerYDifference,

                internalBaselineDifference,

                centerYConsistencyScore,

                baselineConsistencyScore,

                internalConsistencyScore,


                // ------------------------------------------
                // Flags
                // ------------------------------------------

                baselineAligned,

                goodHorizontalAlignment,

                goodVerticalAlignment,

                aligned,


                // ------------------------------------------
                // Worksheet
                // ------------------------------------------

                worksheetWidth,

                worksheetHeight,

            });

        });


        // ======================================================
        // Valid Attempts
        // ======================================================

        const validAttempts =

            attemptResults.filter(

                result =>
                    result.valid

            );


        if (
            validAttempts.length === 0
        ) {

            return {

                ...this.emptyResult(),

                attemptDetails:
                    attemptResults,

            };

        }


        // ======================================================
        // Final Category Score
        // ======================================================

        const score =

            this.average(

                validAttempts.map(

                    result =>
                        result.score

                )

            );


        // ======================================================
        // Component Scores
        // ======================================================

        const baselineComponent =

            this.average(

                validAttempts.map(

                    result =>
                        result.baselineScore

                )

            );


        const horizontalComponent =

            this.average(

                validAttempts.map(

                    result =>
                        result.horizontalScore

                )

            );


        const verticalComponent =

            this.average(

                validAttempts.map(

                    result =>
                        result.verticalScore

                )

            );


        const heightComponent =

            this.average(

                validAttempts.map(

                    result =>
                        result.heightScore

                )

            );


        const consistencyComponent =

            this.average(

                validAttempts.map(

                    result =>
                        result.internalConsistencyScore

                )

            );


        // ======================================================
        // Baseline Statistics
        // ======================================================

        const baselines =

            validAttempts

                .map(

                    result =>
                        result.studentBaseline

                )

                .filter(

                    value =>

                        typeof value === "number" &&

                        Number.isFinite(value)

                );


        const averageBaseline =
            this.average(baselines);


        const sortedBaselines =
            [...baselines].sort(
                (a, b) => a - b
            );


        let medianBaseline = 0;


        if (
            sortedBaselines.length > 0
        ) {

            const middle =

                Math.floor(
                    sortedBaselines.length / 2
                );


            medianBaseline =

                sortedBaselines.length % 2 === 1

                    ? sortedBaselines[middle]

                    : (
                        sortedBaselines[
                            middle - 1
                        ] +

                        sortedBaselines[
                            middle
                        ]
                    ) / 2;

        }


        // ======================================================
        // Baseline Variation
        // ======================================================

        let baselineDeviation = 0;


        if (
            baselines.length > 0
        ) {

            const variance =

                baselines.reduce(

                    (sum, value) =>

                        sum +
                        Math.pow(

                            value -
                            medianBaseline,

                            2

                        ),

                    0

                ) /

                baselines.length;


            baselineDeviation =

                Math.sqrt(
                    variance
                );

        }


        // ======================================================
        // Consistency Percentage
        // ======================================================

        const alignedCount =

            validAttempts.filter(

                result =>
                    result.aligned

            ).length;


        const consistency =

            (
                alignedCount /
                validAttempts.length
            ) * 100;


        // ======================================================
        // Guide Difference
        // ======================================================

        const guideDifferences =

            validAttempts

                .filter(

                    result =>
                        result.guideBaseline !== null

                )

                .map(

                    result =>

                        Math.abs(

                            result.studentBaseline -
                            result.guideBaseline

                        )

                );


        const guideAverageDifference =

            guideDifferences.length > 0

                ? this.average(
                    guideDifferences
                )

                : null;


        const guideScores =

            validAttempts

                .filter(

                    result =>
                        result.guideBaseline !== null

                )

                .map(

                    result =>
                        result.baselineScore

                );


        const guideAverageScore =

            guideScores.length > 0

                ? this.average(
                    guideScores
                )

                : null;


        // ======================================================
        // Return
        // ======================================================

        return {

            score:
                Number(
                    score.toFixed(2)
                ),


            averageBaseline:
                Number(
                    averageBaseline.toFixed(2)
                ),


            medianBaseline:
                Number(
                    medianBaseline.toFixed(2)
                ),


            baselineDeviation:
                Number(
                    baselineDeviation.toFixed(2)
                ),


            consistency:
                Number(
                    consistency.toFixed(2)
                ),


            baselineDifferences:

                validAttempts.map(

                    result =>

                        Number(

                            result.baselineDeviation
                                .toFixed(2)

                        )

                ),


            pairScores:

                validAttempts.map(

                    result =>

                        Number(

                            result.score.toFixed(2)

                        )

                ),


            guideAttempts:

                validAttempts.filter(

                    result =>
                        result.guideBaseline !== null

                ).length,


            guideAverageDifference:

                guideAverageDifference !== null

                    ? Number(
                        guideAverageDifference.toFixed(2)
                    )

                    : null,


            guideAverageScore:

                guideAverageScore !== null

                    ? Number(
                        guideAverageScore.toFixed(2)
                    )

                    : null,


            componentScores: {

                baseline:
                    Number(
                        baselineComponent.toFixed(2)
                    ),

                horizontal:
                    Number(
                        horizontalComponent.toFixed(2)
                    ),

                vertical:
                    Number(
                        verticalComponent.toFixed(2)
                    ),

                height:
                    Number(
                        heightComponent.toFixed(2)
                    ),

                consistency:
                    Number(
                        consistencyComponent.toFixed(2)
                    ),

            },


            attemptsAnalyzed:
                validAttempts.length,


            attemptDetails:

                validAttempts.map(

                    result => ({

                        attemptIndex:
                            result.attemptIndex,

                        promptText:
                            result.promptText,

                        score:
                            Number(
                                result.score.toFixed(2)
                            ),

                        leftCenterX:
                            Number(
                                result.leftCenterX.toFixed(2)
                            ),

                        rightCenterX:
                            Number(
                                result.rightCenterX.toFixed(2)
                            ),

                        leftCenterY:
                            Number(
                                result.leftCenterY.toFixed(2)
                            ),

                        rightCenterY:
                            Number(
                                result.rightCenterY.toFixed(2)
                            ),

                        leftBaseline:
                            Number(
                                result.leftBaseline.toFixed(2)
                            ),

                        rightBaseline:
                            Number(
                                result.rightBaseline.toFixed(2)
                            ),

                        studentBaseline:
                            Number(
                                result.studentBaseline.toFixed(2)
                            ),

                        averageHeight:
                            Number(
                                result.averageHeight.toFixed(2)
                            ),

                        guideBaseline:

                            result.guideBaseline !== null

                                ? Number(
                                    result.guideBaseline.toFixed(2)
                                )

                                : null,

                        baselineDeviation:
                            Number(
                                result.baselineDeviation.toFixed(2)
                            ),

                        baselineScore:
                            Number(
                                result.baselineScore.toFixed(2)
                            ),

                        horizontalDeviation:
                            Number(
                                result.horizontalDeviation.toFixed(2)
                            ),

                        horizontalScore:
                            Number(
                                result.horizontalScore.toFixed(2)
                            ),

                        verticalDeviation:
                            Number(
                                result.verticalDeviation.toFixed(2)
                            ),

                        verticalScore:
                            Number(
                                result.verticalScore.toFixed(2)
                            ),

                        heightDifference:
                            Number(
                                result.heightDifference.toFixed(2)
                            ),

                        heightScore:
                            Number(
                                result.heightScore.toFixed(2)
                            ),

                        internalConsistencyScore:
                            Number(
                                result.internalConsistencyScore.toFixed(2)
                            ),

                        aligned:
                            result.aligned,

                    })

                ),

        };

    }


    // ==========================================================
    // Prompt Text
    // ==========================================================

    static getPromptText(sample) {

        if (!sample) {
            return "";
        }


        const possibleFields = [

            sample.promptText,

            sample.prompt,

            sample.exerciseName,

            sample.activityName,

            sample.targetText,

            sample.target,

            sample.word,

            sample.text,

            sample.activity,

        ];


        for (
            const value of possibleFields
        ) {

            if (
                typeof value === "string" &&
                value.trim().length > 0
            ) {

                return value
                    .trim()
                    .replace(/\s+/g, " ");

            }

        }


        return "";

    }


    // ==========================================================
    // Guide Data
    // ==========================================================

    static getGuideData(sample) {

        if (!sample) {
            return null;
        }


        let guide =
            sample.guide;


        if (
            typeof guide === "string"
        ) {

            try {

                guide =
                    JSON.parse(guide);

            } catch (error) {

                guide = null;

            }

        }


        if (
            !guide ||
            typeof guide !== "object"
        ) {

            guide =
                sample.guide_json;

        }


        if (
            typeof guide === "string"
        ) {

            try {

                guide =
                    JSON.parse(guide);

            } catch (error) {

                guide = null;

            }

        }


        if (
            !guide ||
            typeof guide !== "object"
        ) {

            return null;

        }


        return guide;

    }


    // ==========================================================
    // Worksheet Width
    // ==========================================================

    static getWorksheetWidth(guideData) {

        if (!guideData) {
            return null;
        }


        if (
            guideData.worksheet &&
            typeof guideData.worksheet.width === "number"
        ) {

            return guideData.worksheet.width;

        }


        if (
            typeof guideData.worksheetWidth === "number"
        ) {

            return guideData.worksheetWidth;

        }


        if (
            typeof guideData.width === "number"
        ) {

            return guideData.width;

        }


        return null;

    }


    // ==========================================================
    // Worksheet Height
    // ==========================================================

    static getWorksheetHeight(guideData) {

        if (!guideData) {
            return null;
        }


        if (
            guideData.worksheet &&
            typeof guideData.worksheet.height === "number"
        ) {

            return guideData.worksheet.height;

        }


        if (
            typeof guideData.worksheetHeight === "number"
        ) {

            return guideData.worksheetHeight;

        }


        if (
            typeof guideData.height === "number"
        ) {

            return guideData.height;

        }


        return null;

    }


    // ==========================================================
    // Guide Bounds
    // ==========================================================

    static getGuideBounds(guideData) {

        if (!guideData) {
            return null;
        }


        const guide =

            guideData.guide &&
            typeof guideData.guide === "object"

                ? guideData.guide

                : guideData;


        const left =
            this.firstNumber(

                guide.left,
                guide.minX

            );


        const right =
            this.firstNumber(

                guide.right,
                guide.maxX

            );


        const top =
            this.firstNumber(

                guide.top,
                guide.minY

            );


        const bottom =
            this.firstNumber(

                guide.bottom,
                guide.maxY

            );


        if (

            left === null ||
            right === null ||
            top === null ||
            bottom === null

        ) {

            return null;

        }


        if (
            right <= left ||
            bottom <= top
        ) {

            return null;

        }


        return {

            left,
            right,
            top,
            bottom,

            width:
                right - left,

            height:
                bottom - top,

        };

    }


    // ==========================================================
    // Guide Baseline
    // ==========================================================

    static getGuideBaseline(guideData) {

        if (!guideData) {
            return null;
        }


        const guide =

            guideData.guide &&
            typeof guideData.guide === "object"

                ? guideData.guide

                : guideData;


        if (

            typeof guide.baselineY === "number" &&

            Number.isFinite(
                guide.baselineY
            )

        ) {

            return guide.baselineY;

        }


        if (

            typeof guide.baseline === "number" &&

            Number.isFinite(
                guide.baseline
            )

        ) {

            return guide.baseline;

        }


        if (

            typeof guide.normalizedBaselineY === "number" &&

            guideData.worksheet &&

            typeof guideData.worksheet.height === "number"

        ) {

            return (

                guide.normalizedBaselineY *
                guideData.worksheet.height

            );

        }


        if (

            typeof guide.normalizedBaseline === "number" &&

            guideData.worksheet &&

            typeof guideData.worksheet.height === "number"

        ) {

            return (

                guide.normalizedBaseline *
                guideData.worksheet.height

            );

        }


        return null;

    }


    // ==========================================================
    // Letter Metrics
    // ==========================================================

    static getLetterMetrics(letter) {

        if (!letter) {
            return null;
        }


        const boundingBox =
            letter.boundingBox;


        if (!boundingBox) {
            return null;
        }


        const minX =
            this.firstNumber(
                boundingBox.minX
            );


        const maxX =
            this.firstNumber(
                boundingBox.maxX
            );


        const minY =
            this.firstNumber(
                boundingBox.minY
            );


        const maxY =
            this.firstNumber(
                boundingBox.maxY
            );


        if (

            minX === null ||
            maxX === null ||
            minY === null ||
            maxY === null

        ) {

            return null;

        }


        const width =
            maxX - minX;


        const height =
            maxY - minY;


        if (
            width <= 0 ||
            height <= 0
        ) {

            return null;

        }


        const centerX =

            typeof letter.centerX === "number"

                ? letter.centerX

                : (
                    minX +
                    maxX
                ) / 2;


        const centerY =

            typeof letter.centerY === "number"

                ? letter.centerY

                : (
                    minY +
                    maxY
                ) / 2;


        const baseline =

            typeof letter.baseline === "number"

                ? letter.baseline

                : maxY;


        return {

            minX,
            maxX,
            minY,
            maxY,

            width,
            height,

            centerX,
            centerY,

            baseline,

        };

    }


    // ==========================================================
    // Center X
    // ==========================================================

    static getCenterX(letter) {

        const metrics =
            this.getLetterMetrics(
                letter
            );


        return metrics
            ? metrics.centerX
            : null;

    }


    // ==========================================================
    // Deviation Score
    // ==========================================================
    //
    // Important difference from the previous V5:
    //
    // A deviation inside tolerance is NOT automatically
    // 80–100.
    //
    // 0 error       = 100
    // tolerance     = 75
    // 2× tolerance  = ~50
    // severe range  = 0
    //
    // This makes a 70+ score much harder to obtain when
    // the handwriting is visibly far from the guide.
    // ==========================================================

    static deviationScore(

        error,

        tolerance,

        severeRange

    ) {

        if (

            typeof error !== "number" ||
            !Number.isFinite(error)

        ) {

            return 0;

        }


        tolerance =
            Math.max(
                0.001,
                tolerance || 1
            );


        severeRange =
            Math.max(
                tolerance * 2,
                severeRange || tolerance * 3
            );


        if (
            error <= 0
        ) {

            return 100;

        }


        if (
            error >= severeRange
        ) {

            return 0;

        }


        // Use a quadratic falloff.
        //
        // This deliberately becomes stricter as the
        // deviation grows.

        const normalized =
            error /
            severeRange;


        const score =

            100 *
            (
                1 -
                Math.pow(
                    normalized,
                    1.65
                )
            );


        return Math.max(

            0,

            Math.min(
                100,
                score
            )

        );

    }


    // ==========================================================
    // Ratio Score
    // ==========================================================

    static ratioScore(

        ratio,

        tolerance,

        severeRatio

    ) {

        if (

            typeof ratio !== "number" ||
            !Number.isFinite(ratio)

        ) {

            return 0;

        }


        if (
            ratio <= 0
        ) {

            return 100;

        }


        if (
            ratio >= severeRatio
        ) {

            return 0;

        }


        const normalized =
            ratio /
            severeRatio;


        return Math.max(

            0,

            Math.min(

                100,

                100 *
                (
                    1 -
                    Math.pow(
                        normalized,
                        1.65
                    )
                )

            )

        );

    }


    // ==========================================================
    // Average
    // ==========================================================

    static average(values) {

        const validValues =

            values.filter(

                value =>

                    typeof value === "number" &&

                    Number.isFinite(value)

            );


        if (
            validValues.length === 0
        ) {

            return 0;

        }


        return (

            validValues.reduce(

                (sum, value) =>
                    sum + value,

                0

            ) /

            validValues.length

        );

    }


    // ==========================================================
    // First Number
    // ==========================================================

    static firstNumber(...values) {

        for (
            const value of values
        ) {

            if (

                typeof value === "number" &&

                Number.isFinite(value)

            ) {

                return value;

            }

        }


        return null;

    }


    // ==========================================================
    // Empty Result
    // ==========================================================

    static emptyResult() {

        return {

            score: 0,

            averageBaseline: 0,

            medianBaseline: 0,

            baselineDeviation: 0,

            consistency: 0,

            baselineDifferences: [],

            pairScores: [],

            guideAttempts: 0,

            guideAverageDifference: null,

            guideAverageScore: null,

            componentScores: {

                baseline: 0,

                horizontal: 0,

                vertical: 0,

                height: 0,

                consistency: 0,

            },

            attemptsAnalyzed: 0,

            attemptDetails: [],

        };

    }

}


module.exports = AlignmentAnalyzer;