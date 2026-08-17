const Geometry = require("./Geometry");

class StrokeAnalyzer {

    // ==========================================================
    // Analyze Stroke Quality
    // ==========================================================

    static analyze(data = {}) {

        /*
         * HandwritingAnalyzer currently passes an analyzer object:
         *
         * {
         *     attempts,
         *     samples,
         *     strokes,
         *     features,
         *     clusters,
         *     letters
         * }
         *
         * This analyzer also accepts a raw stroke array for
         * backwards compatibility.
         */

        let strokes = [];
        let features = null;

        /*
         * Optional expected stroke count.
         *
         * If the ReferenceFitAnalyzer / HandwritingAnalyzer
         * provides this in the future, we can use it to penalize
         * excessive stroke fragmentation.
         */
        let expectedStrokeCount = null;

        if (Array.isArray(data)) {

            strokes = data;

        } else if (data && typeof data === "object") {

            strokes =
                Array.isArray(data.strokes)
                    ? data.strokes
                    : [];

            features =
                data.features || null;

            /*
             * Support several possible property names so this
             * analyzer remains compatible with the rest of the
             * system.
             */
            expectedStrokeCount =
                this.getExpectedStrokeCount(data);

        }

        if (
            !Array.isArray(strokes) ||
            strokes.length === 0
        ) {

            return this.emptyResult(
                "No handwriting strokes were provided."
            );

        }

        // ==========================================================
        // Prepare Stroke Items
        // ==========================================================

        let items = [];

        if (
            features &&
            Array.isArray(features.strokeFeatures)
        ) {

            items =
                features.strokeFeatures.filter(
                    item =>
                        item &&
                        Array.isArray(item.stroke) &&
                        item.stroke.length >= 2
                );

        }

        /*
         * Fallback if FeatureExtractor data is unavailable.
         */

        if (items.length === 0) {

            items =
                strokes
                    .filter(
                        stroke =>
                            Array.isArray(stroke) &&
                            stroke.length >= 2
                    )
                    .map(stroke => ({

                        stroke,

                        strokeLength:
                            Geometry.strokeLength(
                                stroke
                            ),

                        pointCount:
                            stroke.length,

                        firstPoint:
                            stroke[0],

                        lastPoint:
                            stroke[stroke.length - 1],

                    }));

        }

        if (items.length === 0) {

            return this.emptyResult(
                "No valid handwriting strokes were detected."
            );

        }

        // ==========================================================
        // Analyze Individual Strokes
        // ==========================================================

        const strokeResults = [];

        items.forEach(
            (item, index) => {

                const stroke =
                    item.stroke;

                if (
                    !Array.isArray(stroke) ||
                    stroke.length < 2
                ) {

                    return;

                }

                const result =
                    this.analyzeSingleStroke(
                        stroke
                    );

                strokeResults.push({

                    strokeIndex:
                        index,

                    ...result,

                });

            }
        );

        if (strokeResults.length === 0) {

            return this.emptyResult(
                "No analyzable handwriting strokes were found."
            );

        }

        // ==========================================================
        // Aggregate Component Scores
        // ==========================================================

        const continuity =
            this.average(
                strokeResults.map(
                    result =>
                        result.continuityScore
                )
            );

        const pointConsistency =
            this.average(
                strokeResults.map(
                    result =>
                        result.pointConsistencyScore
                )
            );

        const directionStability =
            this.average(
                strokeResults.map(
                    result =>
                        result.directionStabilityScore
                )
            );

        const execution =
            this.average(
                strokeResults.map(
                    result =>
                        result.executionScore
                )
            );

        // ==========================================================
        // Stroke Fragmentation
        // ==========================================================

        /*
         * A large number of detected strokes can indicate that the
         * student's movement was fragmented, interrupted, or noisy.
         *
         * We only apply a strong penalty when an expected/reference
         * stroke count is actually available.
         *
         * Without a reference count, we use a conservative
         * fragmentation-quality estimate.
         */

        const strokeFragmentation =
            this.calculateStrokeFragmentationScore(
                strokeResults,
                expectedStrokeCount
            );

        // ==========================================================
        // Final Stroke Score
        // ==========================================================

        /*
         * IMPORTANT:
         *
         * The old formula was:
         *
         * continuity      30%
         * pointConsistency 25%
         * direction       25%
         * execution       20%
         *
         * This was too forgiving.
         *
         * The new formula puts much more emphasis on actual
         * execution quality and directional control.
         *
         * Continuity and point sampling are supporting metrics,
         * not dominant metrics.
         */

        let score =

            (
                execution *
                0.35
            ) +

            (
                directionStability *
                0.25
            ) +

            (
                pointConsistency *
                0.15
            ) +

            (
                continuity *
                0.10
            ) +

            (
                strokeFragmentation *
                0.15
            );

        // ==========================================================
        // Additional Quality Guard
        // ==========================================================

        /*
         * Prevent a stroke from being classified as Excellent
         * when its directional control is clearly weak.
         *
         * This is important for cases where the point sampling
         * is clean but the actual movement is poorly controlled.
         */

        if (
            directionStability < 60
        ) {

            score *= 0.85;

        } else if (
            directionStability < 70
        ) {

            score *= 0.92;

        }

        /*
         * Prevent extremely poor execution from receiving a
         * disproportionately high final score.
         */

        if (
            execution < 55
        ) {

            score = Math.min(
                score,
                65
            );

        } else if (
            execution < 65
        ) {

            score = Math.min(
                score,
                72
            );

        }

        score =
            Math.max(
                0,
                Math.min(
                    100,
                    score
                )
            );

        // ==========================================================
        // Global Metrics
        // ==========================================================

        const totalStrokeLength =
            strokeResults.reduce(
                (
                    total,
                    result
                ) =>
                    total +
                    result.strokeLength,
                0
            );

        const totalPoints =
            strokeResults.reduce(
                (
                    total,
                    result
                ) =>
                    total +
                    result.pointCount,
                0
            );

        const averageStrokeLength =
            totalStrokeLength /
            strokeResults.length;

        const averagePointCount =
            totalPoints /
            strokeResults.length;

        // ==========================================================
        // Return
        // ==========================================================

        return {

            score:
                Number(
                    score.toFixed(2)
                ),

            classification:
                this.classify(
                    score
                ),

            strokeCount:
                strokeResults.length,

            averageStrokeLength:
                Number(
                    averageStrokeLength.toFixed(2)
                ),

            averagePointCount:
                Number(
                    averagePointCount.toFixed(2)
                ),

            continuity:
                Number(
                    continuity.toFixed(2)
                ),

            pointConsistency:
                Number(
                    pointConsistency.toFixed(2)
                ),

            directionStability:
                Number(
                    directionStability.toFixed(2)
                ),

            execution:
                Number(
                    execution.toFixed(2)
                ),

            strokeFragmentation:
                Number(
                    strokeFragmentation.toFixed(2)
                ),

            expectedStrokeCount:
                expectedStrokeCount,

            strokeDetails:
                strokeResults,

        };

    }


    // ==========================================================
    // Analyze One Stroke
    // ==========================================================

    static analyzeSingleStroke(
        stroke
    ) {

        const segmentLengths =
            this.getSegmentLengths(
                stroke
            );

        const turningAngles =
            this.getTurningAngles(
                stroke
            );

        const strokeLength =
            this.sum(
                segmentLengths
            );

        // ======================================================
        // Continuity
        // ======================================================

        const continuityScore =
            this.calculateContinuityScore(
                segmentLengths
            );

        // ======================================================
        // Point Consistency
        // ======================================================

        const pointConsistencyScore =
            this.calculatePointConsistencyScore(
                segmentLengths
            );

        // ======================================================
        // Direction Stability
        // ======================================================

        const directionStabilityScore =
            this.calculateDirectionStabilityScore(
                turningAngles
            );

        // ======================================================
        // Overall Execution
        // ======================================================

        /*
         * Execution is intentionally stricter than before.
         *
         * Direction is the strongest component because it reflects
         * control of the actual movement rather than merely the
         * sampling density of the input device.
         */

        const executionScore =
            (
                directionStabilityScore *
                0.50
            ) +

            (
                pointConsistencyScore *
                0.25
            ) +

            (
                continuityScore *
                0.25
            );

        return {

            pointCount:
                stroke.length,

            strokeLength:
                Number(
                    strokeLength.toFixed(2)
                ),

            segmentAverage:
                Number(
                    this.average(
                        segmentLengths
                    ).toFixed(3)
                ),

            segmentDeviation:
                Number(
                    this.standardDeviation(
                        segmentLengths
                    ).toFixed(3)
                ),

            continuityScore:
                Number(
                    continuityScore.toFixed(2)
                ),

            pointConsistencyScore:
                Number(
                    pointConsistencyScore.toFixed(2)
                ),

            directionStabilityScore:
                Number(
                    directionStabilityScore.toFixed(2)
                ),

            executionScore:
                Number(
                    executionScore.toFixed(2)
                ),

        };

    }


    // ==========================================================
    // Expected Stroke Count
    // ==========================================================

    static getExpectedStrokeCount(
        data
    ) {

        if (
            !data ||
            typeof data !== "object"
        ) {

            return null;

        }

        const possibleValues = [

            data.expectedStrokeCount,

            data.referenceStrokeCount,

            data.targetStrokeCount,

            data.expectedStrokes,

            data.referenceStrokes &&
            Array.isArray(
                data.referenceStrokes
            )
                ? data.referenceStrokes.length
                : null,

            data.reference &&
            Array.isArray(
                data.reference
            )
                ? data.reference.length
                : null,

        ];

        for (
            const value of possibleValues
        ) {

            const number =
                Number(value);

            if (
                Number.isFinite(number) &&
                number > 0
            ) {

                return number;

            }

        }

        return null;

    }


    // ==========================================================
    // Stroke Fragmentation Score
    // ==========================================================

    static calculateStrokeFragmentationScore(
        strokeResults,
        expectedStrokeCount
    ) {

        if (
            !Array.isArray(strokeResults) ||
            strokeResults.length === 0
        ) {

            return 0;

        }

        const actualCount =
            strokeResults.length;

        /*
         * If the reference stroke count is known, compare the
         * student's count directly against it.
         */

        if (
            Number.isFinite(
                expectedStrokeCount
            ) &&
            expectedStrokeCount > 0
        ) {

            const difference =
                Math.abs(
                    actualCount -
                    expectedStrokeCount
                );

            const ratio =
                difference /
                expectedStrokeCount;

            /*
             * Small differences are acceptable.
             */

            if (
                ratio <= 0.10
            ) {

                return 100;

            }

            /*
             * Once the student has substantially more/fewer
             * strokes, apply a strong penalty.
             */

            if (
                ratio >= 1.0
            ) {

                return 30;

            }

            const progress =
                (
                    ratio -
                    0.10
                ) /
                (
                    1.0 -
                    0.10
                );

            return Math.max(
                30,
                100 -
                (
                    progress *
                    70
                )
            );

        }

        /*
         * If no reference count is available, don't punish the
         * child simply because the pattern legitimately contains
         * several strokes.
         *
         * Instead, look for unusually fragmented individual
         * strokes.
         */

        const averagePointCount =
            this.average(
                strokeResults.map(
                    result =>
                        result.pointCount
                )
            );

        const averageSegmentDeviation =
            this.average(
                strokeResults.map(
                    result =>
                        result.segmentDeviation
                )
            );

        /*
         * Very low point counts can indicate fragmented strokes.
         */

        let score = 100;

        if (
            averagePointCount < 8
        ) {

            score -= 20;

        }

        if (
            averagePointCount < 5
        ) {

            score -= 20;

        }

        /*
         * Very high segment variation is another indicator of
         * unstable or fragmented movement.
         */

        if (
            averageSegmentDeviation > 15
        ) {

            score -= 15;

        }

        if (
            averageSegmentDeviation > 25
        ) {

            score -= 15;

        }

        return Math.max(
            30,
            Math.min(
                100,
                score
            )
        );

    }


    // ==========================================================
    // Segment Lengths
    // ==========================================================

    static getSegmentLengths(
        stroke
    ) {

        const lengths = [];

        for (
            let i = 1;
            i < stroke.length;
            i++
        ) {

            const previous =
                stroke[i - 1];

            const current =
                stroke[i];

            if (
                !previous ||
                !current
            ) {

                continue;

            }

            const distance =
                Geometry.distance(
                    previous,
                    current
                );

            if (
                Number.isFinite(distance) &&
                distance > 0
            ) {

                lengths.push(
                    distance
                );

            }

        }

        return lengths;

    }


    // ==========================================================
    // Turning Angles
    // ==========================================================

    static getTurningAngles(
        stroke
    ) {

        const angles = [];

        if (
            stroke.length < 3
        ) {

            return angles;

        }

        for (
            let i = 1;
            i < stroke.length - 1;
            i++
        ) {

            const p1 =
                stroke[i - 1];

            const p2 =
                stroke[i];

            const p3 =
                stroke[i + 1];

            const angle1 =
                Math.atan2(
                    p2.y - p1.y,
                    p2.x - p1.x
                );

            const angle2 =
                Math.atan2(
                    p3.y - p2.y,
                    p3.x - p2.x
                );

            let delta =
                angle2 -
                angle1;

            /*
             * Normalize to [-PI, PI].
             */

            while (
                delta > Math.PI
            ) {

                delta -=
                    Math.PI * 2;

            }

            while (
                delta < -Math.PI
            ) {

                delta +=
                    Math.PI * 2;

            }

            angles.push(
                Math.abs(delta)
            );

        }

        return angles;

    }


    // ==========================================================
    // Continuity Score
    // ==========================================================

    static calculateContinuityScore(
        segmentLengths
    ) {

        if (
            !Array.isArray(segmentLengths) ||
            segmentLengths.length === 0
        ) {

            return 0;

        }

        const median =
            this.median(
                segmentLengths
            );

        if (
            median <= 0
        ) {

            return 100;

        }

        /*
         * Detect unusually large jumps between recorded points.
         */

        const jumpThreshold =
            Math.max(
                median * 3.0,
                18
            );

        const largeJumps =
            segmentLengths.filter(
                length =>
                    length >
                    jumpThreshold
            ).length;

        const jumpRatio =
            largeJumps /
            segmentLengths.length;

        if (
            jumpRatio <= 0.005
        ) {

            return 100;

        }

        if (
            jumpRatio >= 0.20
        ) {

            return 30;

        }

        const progress =
            (
                jumpRatio -
                0.005
            ) /
            (
                0.20 -
                0.005
            );

        return Math.max(
            30,
            100 -
            (
                progress *
                70
            )
        );

    }


    // ==========================================================
    // Point Consistency Score
    // ==========================================================

    static calculatePointConsistencyScore(
        segmentLengths
    ) {

        if (
            !Array.isArray(segmentLengths) ||
            segmentLengths.length < 2
        ) {

            return 100;

        }

        const mean =
            this.average(
                segmentLengths
            );

        if (
            mean <= 0
        ) {

            return 100;

        }

        const deviation =
            this.standardDeviation(
                segmentLengths
            );

        const coefficient =
            deviation /
            mean;

        /*
         * Previous threshold of 0.45 was too forgiving.
         *
         * A coefficient around 0.30 or lower represents very
         * consistent sampling.
         */

        if (
            coefficient <= 0.30
        ) {

            return 100;

        }

        if (
            coefficient >= 1.20
        ) {

            return 35;

        }

        const progress =
            (
                coefficient -
                0.30
            ) /
            (
                1.20 -
                0.30
            );

        return Math.max(
            35,
            100 -
            (
                progress *
                65
            )
        );

    }


    // ==========================================================
    // Direction Stability Score
    // ==========================================================

    static calculateDirectionStabilityScore(
        turningAngles
    ) {

        if (
            !Array.isArray(turningAngles) ||
            turningAngles.length < 3
        ) {

            return 100;

        }

        /*
         * We evaluate turning consistency rather than absolute
         * direction.
         *
         * This means:
         *
         * - circles are allowed
         * - curves are allowed
         * - waves are allowed
         * - zigzags are allowed
         */

        const median =
            this.median(
                turningAngles
            );

        const deviation =
            this.standardDeviation(
                turningAngles
            );

        const scale =
            Math.max(
                median,
                this.degreesToRadians(8)
            );

        const variation =
            deviation /
            scale;

        /*
         * Clean directional movement.
         */

        if (
            variation <= 0.30
        ) {

            return 100;

        }

        /*
         * Moderate instability.
         */

        if (
            variation >= 1.50
        ) {

            return 35;

        }

        const progress =
            (
                variation -
                0.30
            ) /
            (
                1.50 -
                0.30
            );

        return Math.max(
            35,
            100 -
            (
                progress *
                65
            )
        );

    }


    // ==========================================================
    // Median
    // ==========================================================

    static median(
        values
    ) {

        if (
            !Array.isArray(values) ||
            values.length === 0
        ) {

            return 0;

        }

        const sorted =
            [...values]
                .filter(
                    Number.isFinite
                )
                .sort(
                    (a, b) =>
                        a - b
                );

        if (
            sorted.length === 0
        ) {

            return 0;

        }

        const middle =
            Math.floor(
                sorted.length / 2
            );

        if (
            sorted.length % 2 === 0
        ) {

            return (
                sorted[middle - 1] +
                sorted[middle]
            ) / 2;

        }

        return sorted[middle];

    }


    // ==========================================================
    // Average
    // ==========================================================

    static average(
        values
    ) {

        if (
            !Array.isArray(values) ||
            values.length === 0
        ) {

            return 0;

        }

        const valid =
            values.filter(
                Number.isFinite
            );

        if (
            valid.length === 0
        ) {

            return 0;

        }

        return (
            this.sum(valid) /
            valid.length
        );

    }


    // ==========================================================
    // Standard Deviation
    // ==========================================================

    static standardDeviation(
        values
    ) {

        if (
            !Array.isArray(values) ||
            values.length === 0
        ) {

            return 0;

        }

        const valid =
            values.filter(
                Number.isFinite
            );

        if (
            valid.length === 0
        ) {

            return 0;

        }

        const mean =
            this.average(
                valid
            );

        const variance =
            this.average(
                valid.map(
                    value =>
                        Math.pow(
                            value - mean,
                            2
                        )
                )
            );

        return Math.sqrt(
            variance
        );

    }


    // ==========================================================
    // Sum
    // ==========================================================

    static sum(
        values
    ) {

        if (
            !Array.isArray(values)
        ) {

            return 0;

        }

        return values.reduce(
            (
                total,
                value
            ) =>
                total +
                (
                    Number(value) ||
                    0
                ),
            0
        );

    }


    // ==========================================================
    // Degrees → Radians
    // ==========================================================

    static degreesToRadians(
        degrees
    ) {

        return (
            degrees *
            Math.PI /
            180
        );

    }


    // ==========================================================
    // Classification
    // ==========================================================

    static classify(
        score
    ) {

        if (
            score >= 90
        ) {

            return "Excellent";

        }

        if (
            score >= 80
        ) {

            return "Good";

        }

        if (
            score >= 70
        ) {

            return "Fair";

        }

        if (
            score >= 60
        ) {

            return "Needs Improvement";

        }

        return "Poor";

    }


    // ==========================================================
    // Empty Result
    // ==========================================================

    static emptyResult(
        reason
    ) {

        return {

            score: 0,

            classification:
                "Needs Improvement",

            strokeCount: 0,

            averageStrokeLength: 0,

            averagePointCount: 0,

            continuity: 0,

            pointConsistency: 0,

            directionStability: 0,

            execution: 0,

            strokeFragmentation: 0,

            expectedStrokeCount: null,

            strokeDetails: [],

            valid: false,

            reason:
                reason ||
                "Stroke analysis could not be completed.",

        };

    }

}

module.exports =
    StrokeAnalyzer;