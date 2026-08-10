const StrokeNormalizer =
    require("./StrokeNormalizer");

const LetterSegmenter =
    require("./LetterSegmenter");

const ReferenceGeometry =
    require("./ReferenceGeometry");


class AlignmentAnalyzer {

    // ==========================================================
    // KineWrite Alignment Analyzer
    // ==========================================================
    //
    // Alignment activities:
    //
    // 1. A a
    // 2. B b
    // 3. C c
    // 4. D d
    // 5. E e
    //
    // The analyzer evaluates:
    //
    // 1. Reference fit
    // 2. Baseline alignment
    // 3. Horizontal placement
    // 4. Vertical placement
    // 5. Letter height
    // 6. Internal consistency
    //
    // IMPORTANT:
    //
    // ReferenceGeometry represents the intended LOCATION
    // of the writing, not an exact handwriting shape.
    //
    // Therefore, natural variation in handwriting must not
    // receive an unnecessarily large penalty.
    // ==========================================================


    // ==========================================================
    // Analyze
    // ==========================================================

    static analyze(data) {

        const {
            samples = [],
        } = data || {};


        if (
            !Array.isArray(samples) ||
            samples.length === 0
        ) {

            return this.emptyResult();

        }


        const attemptResults = [];


        // ======================================================
        // Analyze Every Sample
        // ======================================================

        samples.forEach((sample, index) => {

            if (!sample) {
                return;
            }


            // ==================================================
            // Get Stroke Data
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
            // Normalize Strokes
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
            // Sort Left → Right
            // ==================================================

            const sortedLetters =

                letters

                    .filter(

                        letter =>

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
            // Guide
            // ==================================================

            const guideData =
                this.getGuideData(sample);


            const worksheetWidth =
                this.getWorksheetWidth(
                    guideData
                ) || 1278;


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
            // Prompt
            // ==================================================

            const promptText =
                this.getPromptText(sample);


            // ==================================================
            // Reference Geometry
            // ==================================================

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
            // Basic Student Metrics
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
            // Reference Tolerances
            // ==================================================

            const referenceTolerance =

                ReferenceGeometry.getAlignmentTolerance(

                    worksheetWidth,

                    worksheetHeight

                );


            // ==================================================
            // 1. REFERENCE FIT
            // ==================================================
            //
            // This is the most important addition.
            //
            // Reference fit evaluates whether the two detected
            // letters occupy the expected areas of the worksheet.
            //
            // It intentionally uses generous tolerances because
            // children will naturally vary in letter size and
            // position.
            // ==========================================================

            let referenceFitScore = 100;

            let referenceFitAvailable = false;

            let referenceLeftScore = 100;

            let referenceRightScore = 100;

            let referenceBaselineScore = 100;

            let referenceVerticalScore = 100;


            if (reference) {

                referenceFitAvailable = true;


                // ----------------------------------------------
                // Reference center X
                // ----------------------------------------------

                const leftXError =

                    Math.abs(

                        left.centerX -
                        reference.left.centerX

                    );


                const rightXError =

                    Math.abs(

                        right.centerX -
                        reference.right.centerX

                    );


                const centerXTolerance =

                    Math.max(

                        referenceTolerance?.centerX || 50,

                        worksheetWidth * 0.06

                    );


                const centerXSevere =

                    Math.max(

                        referenceTolerance?.severeCenterX || 200,

                        worksheetWidth * 0.20

                    );


                const leftXScore =

                    this.referenceDeviationScore(

                        leftXError,

                        centerXTolerance,

                        centerXSevere

                    );


                const rightXScore =

                    this.referenceDeviationScore(

                        rightXError,

                        centerXTolerance,

                        centerXSevere

                    );


                // ----------------------------------------------
                // Reference vertical placement
                // ----------------------------------------------

                const leftCenterYError =

                    Math.abs(

                        left.centerY -
                        reference.left.centerY

                    );


                const rightCenterYError =

                    Math.abs(

                        right.centerY -
                        reference.right.centerY

                    );


                const centerYTolerance =

                    Math.max(

                        referenceTolerance?.centerY || 30,

                        worksheetHeight * 0.055

                    );


                const centerYSevere =

                    Math.max(

                        referenceTolerance?.severeCenterY || 120,

                        worksheetHeight * 0.20

                    );


                const leftYScore =

                    this.referenceDeviationScore(

                        leftCenterYError,

                        centerYTolerance,

                        centerYSevere

                    );


                const rightYScore =

                    this.referenceDeviationScore(

                        rightCenterYError,

                        centerYTolerance,

                        centerYSevere

                    );


                referenceVerticalScore =

                    (
                        leftYScore +
                        rightYScore
                    ) / 2;


                // ----------------------------------------------
                // Reference baseline
                // ----------------------------------------------

                const referenceBaselineError =

                    Math.abs(

                        studentBaseline -
                        reference.baseline

                    );


                const baselineReferenceTolerance =

                    Math.max(

                        referenceTolerance?.baseline || 18,

                        worksheetHeight * 0.035

                    );


                const baselineReferenceSevere =

                    Math.max(

                        referenceTolerance?.severeBaseline || 90,

                        worksheetHeight * 0.15

                    );


                referenceBaselineScore =

                    this.referenceDeviationScore(

                        referenceBaselineError,

                        baselineReferenceTolerance,

                        baselineReferenceSevere

                    );


                // ----------------------------------------------
                // Reference height
                //
                // Height is intentionally LOW weight here.
                // A child's handwriting does not have to exactly
                // reproduce the template dimensions.
                // ----------------------------------------------

                const leftHeightError =

                    Math.abs(

                        left.height -
                        reference.left.height

                    );


                const rightHeightError =

                    Math.abs(

                        right.height -
                        reference.right.height

                    );


                const heightTolerance =

                    Math.max(

                        worksheetHeight * 0.08,

                        30

                    );


                const heightSevere =

                    Math.max(

                        worksheetHeight * 0.30,

                        120

                    );


                const leftHeightScore =

                    this.referenceDeviationScore(

                        leftHeightError,

                        heightTolerance,

                        heightSevere

                    );


                const rightHeightScore =

                    this.referenceDeviationScore(

                        rightHeightError,

                        heightTolerance,

                        heightSevere

                    );


                const referenceHeightScore =

                    (
                        leftHeightScore +
                        rightHeightScore
                    ) / 2;


                // ----------------------------------------------
                // Final reference fit
                // ----------------------------------------------
                //
                // Position receives the largest share.
                //
                // X       45%
                // Y       25%
                // Baseline20%
                // Height  10%
                // ----------------------------------------------

                const horizontalReferenceScore =

                    (
                        leftXScore +
                        rightXScore
                    ) / 2;


                referenceFitScore =

                    (
                        horizontalReferenceScore *
                        0.45
                    ) +

                    (
                        referenceVerticalScore *
                        0.25
                    ) +

                    (
                        referenceBaselineScore *
                        0.20
                    ) +

                    (
                        referenceHeightScore *
                        0.10
                    );

            }


            // ==================================================
            // 2. BASELINE SCORE
            // ==================================================

            const internalBaselineDifference =

                Math.abs(

                    left.baseline -
                    right.baseline

                );


            let baselineDeviation =

                internalBaselineDifference;


            let baselineScore = 100;


            if (
                guideBaseline !== null
            ) {

                baselineDeviation =

                    Math.abs(

                        studentBaseline -
                        guideBaseline

                    );


                const baselineTolerance =

                    Math.max(

                        referenceTolerance?.baseline || 18,

                        worksheetHeight * 0.035

                    );


                const baselineSevereRange =

                    Math.max(

                        referenceTolerance?.severeBaseline || 90,

                        worksheetHeight * 0.15

                    );


                const guideBaselineScore =

                    this.referenceDeviationScore(

                        baselineDeviation,

                        baselineTolerance,

                        baselineSevereRange

                    );


                const internalBaselineScore =

                    this.referenceDeviationScore(

                        internalBaselineDifference,

                        Math.max(
                            12,
                            averageHeight * 0.10
                        ),

                        Math.max(
                            60,
                            averageHeight * 0.40
                        )

                    );


                    let referenceBaselineScore = 100;

                    if (reference) {
                    
                        const referenceBaselineError =
                            Math.abs(
                                studentBaseline -
                                reference.baseline
                            );
                    
                        const referenceBaselineTolerance =
                            Math.max(
                                worksheetHeight * 0.05,
                                25
                            );
                    
                        const referenceBaselineSevere =
                            Math.max(
                                worksheetHeight * 0.18,
                                100
                            );
                    
                        referenceBaselineScore =
                            this.referenceDeviationScore(
                                referenceBaselineError,
                                referenceBaselineTolerance,
                                referenceBaselineSevere
                            );
                    }
                    
                    
                    /*
                     * CALIBRATED BASELINE SCORING
                     *
                     * Reference geometry is the primary authority.
                     *
                     * 70% = reference baseline
                     * 20% = guide baseline
                     * 10% = internal consistency
                     *
                     * This prevents a correctly positioned child-written
                     * letter from being unnecessarily penalized because the
                     * detected worksheet guide baseline differs slightly
                     * from the reference geometry.
                     */
                    
                    baselineScore =
                    
                        (
                            referenceBaselineScore *
                            0.70
                        ) +
                    
                        (
                            guideBaselineScore *
                            0.20
                        ) +
                    
                        (
                            internalBaselineScore *
                            0.10
                        );

            } else {

                baselineScore =

                    this.referenceDeviationScore(

                        internalBaselineDifference,

                        Math.max(
                            12,
                            averageHeight * 0.10
                        ),

                        Math.max(
                            60,
                            averageHeight * 0.40
                        )

                    );

            }


            // ==================================================
            // 3. HORIZONTAL POSITION
            // ==================================================
            //
            // IMPORTANT CALIBRATION:
            //
            // The previous analyzer made horizontal placement
            // too strict.
            //
            // Reference fit now handles the overall positional
            // relationship.
            //
            // Horizontal score therefore measures whether the
            // letters are sensibly positioned relative to the
            // reference, with a wider natural tolerance.
            // ==================================================

            let horizontalScore = 100;

            let horizontalDeviation = 0;

            let expectedLeftX = null;

            let expectedRightX = null;

            let leftHorizontalScore = 100;

            let rightHorizontalScore = 100;


            if (reference) {

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


                // Wider tolerance than V7.
                //
                // A child does not need to place the letter
                // exactly at the reference center.

                const horizontalTolerance =

                    Math.max(

                        worksheetWidth * 0.075,

                        referenceTolerance?.centerX || 60

                    );


                const horizontalSevereRange =

                    Math.max(

                        worksheetWidth * 0.22,

                        referenceTolerance?.severeCenterX || 220

                    );


                leftHorizontalScore =

                    this.referenceDeviationScore(

                        leftDeviation,

                        horizontalTolerance,

                        horizontalSevereRange

                    );


                rightHorizontalScore =

                    this.referenceDeviationScore(

                        rightDeviation,

                        horizontalTolerance,

                        horizontalSevereRange

                    );


                horizontalScore =

                    (
                        (
                            leftHorizontalScore +
                            rightHorizontalScore
                        ) / 2
                    ) * 0.65 +

                    (
                        Math.min(

                            leftHorizontalScore,
                            rightHorizontalScore

                        )
                    ) * 0.35;

            } else if (
                guideBounds
            ) {

                const expectedLeft =

                    guideBounds.left +
                    guideBounds.width * 0.25;


                const expectedRight =

                    guideBounds.left +
                    guideBounds.width * 0.75;


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


                const horizontalTolerance =

                    Math.max(

                        30,
                        guideBounds.width * 0.075

                    );


                const horizontalSevereRange =

                    Math.max(

                        120,
                        guideBounds.width * 0.22

                    );


                leftHorizontalScore =

                    this.referenceDeviationScore(

                        leftDeviation,
                        horizontalTolerance,
                        horizontalSevereRange

                    );


                rightHorizontalScore =

                    this.referenceDeviationScore(

                        rightDeviation,
                        horizontalTolerance,
                        horizontalSevereRange

                    );


                horizontalScore =

                    (
                        (
                            leftHorizontalScore +
                            rightHorizontalScore
                        ) / 2
                    ) * 0.65 +

                    (
                        Math.min(

                            leftHorizontalScore,
                            rightHorizontalScore

                        )
                    ) * 0.35;

            }


            // ==================================================
            // 4. VERTICAL PLACEMENT
            // ==================================================

            let verticalScore = 100;

            let verticalDeviation = 0;

            let leftVerticalScore = 100;

            let rightVerticalScore = 100;


            if (reference) {

                const leftTopDeviation =

                    Math.abs(

                        left.minY -
                        reference.left.top

                    );


                const leftBottomDeviation =

                    Math.abs(

                        left.maxY -
                        reference.left.bottom

                    );


                const rightTopDeviation =

                    Math.abs(

                        right.minY -
                        reference.right.top

                    );


                const rightBottomDeviation =

                    Math.abs(

                        right.maxY -
                        reference.right.bottom

                    );


                verticalDeviation =

                    (
                        leftTopDeviation +
                        leftBottomDeviation +
                        rightTopDeviation +
                        rightBottomDeviation
                    ) / 4;


                const verticalTolerance =

                    Math.max(

                        worksheetHeight * 0.055,

                        referenceTolerance?.centerY || 30

                    );


                const verticalSevereRange =

                    Math.max(

                        worksheetHeight * 0.20,

                        referenceTolerance?.severeCenterY || 120

                    );


                leftVerticalScore =

                    (
                        this.referenceDeviationScore(

                            leftTopDeviation,
                            verticalTolerance,
                            verticalSevereRange

                        ) * 0.50
                    ) +

                    (
                        this.referenceDeviationScore(

                            leftBottomDeviation,
                            verticalTolerance,
                            verticalSevereRange

                        ) * 0.50
                    );


                rightVerticalScore =

                    (
                        this.referenceDeviationScore(

                            rightTopDeviation,
                            verticalTolerance,
                            verticalSevereRange

                        ) * 0.50
                    ) +

                    (
                        this.referenceDeviationScore(

                            rightBottomDeviation,
                            verticalTolerance,
                            verticalSevereRange

                        ) * 0.50
                    );


                verticalScore =

                    (
                        (
                            leftVerticalScore +
                            rightVerticalScore
                        ) / 2
                    ) * 0.65 +

                    (
                        Math.min(

                            leftVerticalScore,
                            rightVerticalScore

                        )
                    ) * 0.35;

            } else if (
                guideBounds
            ) {

                const guideCenterY =

                    (
                        guideBounds.top +
                        guideBounds.bottom
                    ) / 2;


                const leftDeviation =

                    Math.abs(

                        left.centerY -
                        guideCenterY

                    );


                const rightDeviation =

                    Math.abs(

                        right.centerY -
                        guideCenterY

                    );


                verticalDeviation =

                    (
                        leftDeviation +
                        rightDeviation
                    ) / 2;


                const verticalTolerance =

                    Math.max(

                        30,
                        guideBounds.height * 0.055

                    );


                const verticalSevereRange =

                    Math.max(

                        120,
                        guideBounds.height * 0.20

                    );


                leftVerticalScore =

                    this.referenceDeviationScore(

                        leftDeviation,
                        verticalTolerance,
                        verticalSevereRange

                    );


                rightVerticalScore =

                    this.referenceDeviationScore(

                        rightDeviation,
                        verticalTolerance,
                        verticalSevereRange

                    );


                verticalScore =

                    (
                        (
                            leftVerticalScore +
                            rightVerticalScore
                        ) / 2
                    ) * 0.65 +

                    (
                        Math.min(

                            leftVerticalScore,
                            rightVerticalScore

                        )
                    ) * 0.35;

            }


            // ==================================================
            // 5. HEIGHT
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


            const heightConsistencyScore =

                this.ratioScore(

                    relativeHeightDifference,

                    0.10,

                    0.35

                );


            let referenceHeightScore = 100;


            if (reference) {

                const leftHeightError =

                    Math.abs(

                        left.height -
                        reference.left.height

                    );


                const rightHeightError =

                    Math.abs(

                        right.height -
                        reference.right.height

                    );


                const heightTolerance =

                    Math.max(

                        worksheetHeight * 0.08,
                        30

                    );


                const heightSevereRange =

                    Math.max(

                        worksheetHeight * 0.30,
                        120

                    );


                const leftReferenceHeightScore =

                    this.referenceDeviationScore(

                        leftHeightError,
                        heightTolerance,
                        heightSevereRange

                    );


                const rightReferenceHeightScore =

                    this.referenceDeviationScore(

                        rightHeightError,
                        heightTolerance,
                        heightSevereRange

                    );


                referenceHeightScore =

                    (
                        leftReferenceHeightScore +
                        rightReferenceHeightScore
                    ) / 2;

            }


            const heightScore =

                (
                    heightConsistencyScore *
                    0.45
                ) +

                (
                    referenceHeightScore *
                    0.55
                );


            // ==================================================
            // 6. INTERNAL CONSISTENCY
            // ==================================================

            const centerYDifference =

                Math.abs(

                    left.centerY -
                    right.centerY

                );


            const centerYConsistencyScore =

                this.referenceDeviationScore(

                    centerYDifference,

                    Math.max(
                        14,
                        averageHeight * 0.10
                    ),

                    Math.max(
                        70,
                        averageHeight * 0.45
                    )

                );


            const baselineConsistencyScore =

                this.referenceDeviationScore(

                    internalBaselineDifference,

                    Math.max(
                        14,
                        averageHeight * 0.10
                    ),

                    Math.max(
                        70,
                        averageHeight * 0.45
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
            // 7. FINAL SCORE
            // ==================================================
            //
            // Reference Fit        30%
            // Baseline              25%
            // Horizontal            20%
            // Vertical              15%
            // Height                5%
            // Consistency           5%
            //
            // This is intentionally different from V7.
            //
            // The reference is now the main positional anchor.
            // Horizontal raw deviation cannot dominate the score.
            // ==================================================

            const weightedScore =

                (
                    referenceFitScore *
                    0.35
                ) +

                (
                    baselineScore *
                    0.20
                ) +

                (
                    horizontalScore *
                    0.20
                ) +

                (
                    verticalScore *
                    0.15
                ) +

                (
                    heightScore *
                    0.05
                ) +

                (
                    internalConsistencyScore *
                    0.05
                );


            // ==================================================
            // Weakest Component Guard
            // ==================================================
            //
            // We still want genuinely poor alignment to matter,
            // but we do NOT let a single moderately low component
            // destroy an otherwise good sample.
            // ==================================================

            const weakestCoreComponent =

                Math.min(

                    referenceFitScore,
                    baselineScore,
                    horizontalScore,
                    verticalScore

                );


            let exerciseScore =

                (
                    weightedScore *
                    0.90
                ) +

                (
                    weakestCoreComponent *
                    0.10
                );


            // ==================================================
            // Severe Failure Guards
            // ==================================================
            //
            // These are only activated when the handwriting is
            // clearly outside the expected area.
            // ==================================================

            if (

                referenceFitScore < 30 ||
                baselineScore < 30 ||
                verticalScore < 30

            ) {

                exerciseScore =

                    Math.min(

                        exerciseScore,
                        49

                    );

            } else if (

                referenceFitScore < 45 ||
                baselineScore < 45 ||
                verticalScore < 45

            ) {

                exerciseScore =

                    Math.min(

                        exerciseScore,
                        59

                    );

            }


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

            const baselineToleranceForFlag =

                Math.max(

                    referenceTolerance?.baseline || 18,

                    worksheetHeight * 0.035

                );


            const baselineAligned =

                baselineDeviation <=
                baselineToleranceForFlag;


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

                referenceFitAvailable,

                referenceBaselineScore,

                referenceFitScore,

                referenceLeftScore,

                referenceRightScore,

                referenceBaselineScore,

                referenceVerticalScore,

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

                baselineScore,


                // ------------------------------------------
                // Horizontal
                // ------------------------------------------

                horizontalDeviation,

                horizontalScore,

                leftHorizontalScore,

                rightHorizontalScore,


                // ------------------------------------------
                // Vertical
                // ------------------------------------------

                verticalDeviation,

                verticalScore,

                leftVerticalScore,

                rightVerticalScore,


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
        // Category Score
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

        const referenceFitComponent =

            this.average(

                validAttempts.map(

                    result =>
                        result.referenceFitScore

                )

            );


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

                (a, b) =>
                    a - b

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
        // Consistency
        // ======================================================
        //
        // IMPORTANT:
        //
        // One actual attempt should NOT be reported as 0%
        // consistency just because there are no repeated
        // attempts.
        //
        // When there is only one valid attempt, consistency
        // reflects that attempt's internal consistency score.
        // ======================================================

        let consistency;


        if (
            validAttempts.length === 1
        ) {

            consistency =

                Number(

                    validAttempts[0]
                        .internalConsistencyScore

                );

        } else {

            const alignedCount =

                validAttempts.filter(

                    result =>
                        result.aligned

                ).length;


            const attemptAlignmentPercentage =

                (
                    alignedCount /
                    validAttempts.length
                ) * 100;


            consistency =

                (
                    attemptAlignmentPercentage *
                    0.70
                ) +

                (
                    consistencyComponent *
                    0.30
                );

        }


        // ======================================================
        // Guide Statistics
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

                        guideAverageDifference
                            .toFixed(2)

                    )

                    : null,


            guideAverageScore:

                guideAverageScore !== null

                    ? Number(

                        guideAverageScore
                            .toFixed(2)

                    )

                    : null,


            // ==================================================
            // Component Scores
            // ==================================================

            componentScores: {

                referenceFit:

                    Number(

                        referenceFitComponent
                            .toFixed(2)

                    ),

                baseline:

                    Number(

                        baselineComponent
                            .toFixed(2)

                    ),

                horizontal:

                    Number(

                        horizontalComponent
                            .toFixed(2)

                    ),

                vertical:

                    Number(

                        verticalComponent
                            .toFixed(2)

                    ),

                height:

                    Number(

                        heightComponent
                            .toFixed(2)

                    ),

                consistency:

                    Number(

                        consistencyComponent
                            .toFixed(2)

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

                        referenceFitAvailable:
                            result.referenceFitAvailable,

                        referenceFitScore:
                            Number(
                                result.referenceFitScore
                                    .toFixed(2)
                            ),

                        referenceLeftScore:
                            Number(
                                result.referenceLeftScore
                                    .toFixed(2)
                            ),

                        referenceRightScore:
                            Number(
                                result.referenceRightScore
                                    .toFixed(2)
                            ),

                        referenceBaselineScore:
                            Number(
                                result.referenceBaselineScore
                                    .toFixed(2)
                            ),

                        referenceVerticalScore:
                            Number(
                                result.referenceVerticalScore
                                    .toFixed(2)
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
                                    result.guideBaseline
                                        .toFixed(2)
                                )

                                : null,

                        baselineDeviation:
                            Number(
                                result.baselineDeviation
                                    .toFixed(2)
                            ),

                        baselineScore:
                            Number(
                                result.baselineScore
                                    .toFixed(2)
                            ),

                        horizontalDeviation:
                            Number(
                                result.horizontalDeviation
                                    .toFixed(2)
                            ),

                        horizontalScore:
                            Number(
                                result.horizontalScore
                                    .toFixed(2)
                            ),

                        verticalDeviation:
                            Number(
                                result.verticalDeviation
                                    .toFixed(2)
                            ),

                        verticalScore:
                            Number(
                                result.verticalScore
                                    .toFixed(2)
                            ),

                        heightDifference:
                            Number(
                                result.heightDifference
                                    .toFixed(2)
                            ),

                        heightScore:
                            Number(
                                result.heightScore
                                    .toFixed(2)
                            ),

                        internalConsistencyScore:
                            Number(
                                result.internalConsistencyScore
                                    .toFixed(2)
                            ),

                        leftHorizontalScore:
                            Number(
                                result.leftHorizontalScore
                                    .toFixed(2)
                            ),

                        rightHorizontalScore:
                            Number(
                                result.rightHorizontalScore
                                    .toFixed(2)
                            ),

                        leftVerticalScore:
                            Number(
                                result.leftVerticalScore
                                    .toFixed(2)
                            ),

                        rightVerticalScore:
                            Number(
                                result.rightVerticalScore
                                    .toFixed(2)
                            ),

                        aligned:
                            result.aligned,

                    })

                ),

        };

    }


    // ==========================================================
    // Reference Deviation Score
    // ==========================================================
    //
    // CALIBRATED FOR CHILD HANDWRITING
    //
    // 0 error
    //      = 100
    //
    // within tolerance
    //      = 100 → 90
    //
    // moderate deviation
    //      = 90 → 35
    //
    // severe deviation
    //      = 35 → 0
    //
    // This is intentionally more forgiving than the old V7
    // horizontal scoring.
    // ==========================================================

    static referenceDeviationScore(

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

                Number(tolerance) || 1

            );


        severeRange =

            Math.max(

                tolerance * 2.5,

                Number(severeRange) || tolerance * 3

            );


        if (
            error <= 0
        ) {

            return 100;

        }


        if (
            error <= tolerance
        ) {

            const ratio =

                error /
                tolerance;


            return Math.max(

                90,

                100 -
                (
                    ratio *
                    10
                )

            );

        }


        if (
            error >= severeRange
        ) {

            return 0;

        }


        const normalized =

            (
                error -
                tolerance
            ) /
            (
                severeRange -
                tolerance
            );


        const score =

            90 *

            (
                1 -
                Math.pow(
                    normalized,
                    1.25
                )

            );


        return Math.max(

            0,

            Math.min(

                90,

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


        tolerance =

            Math.max(

                0.0001,

                Number(tolerance) || 0.01

            );


        severeRatio =

            Math.max(

                tolerance * 2.5,

                Number(severeRatio) ||
                tolerance * 3

            );


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


        if (
            ratio <= tolerance
        ) {

            const normalized =

                ratio /
                tolerance;


            return Math.max(

                90,

                100 -
                (
                    normalized *
                    10
                )

            );

        }


        const normalized =

            (
                ratio -
                tolerance
            ) /
            (
                severeRatio -
                tolerance
            );


        return Math.max(

            0,

            Math.min(

                90,

                90 *
                (
                    1 -
                    Math.pow(
                        normalized,
                        1.25
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

                referenceFit: 0,

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