const { PNG } = require("pngjs");

class ReferenceFitAnalyzer {

    // ==========================================================
    // MAIN ANALYZER
    // ==========================================================

    static analyze({
        samples = [],
        options = {},
    } = {}) {

        if (
            !Array.isArray(samples) ||
            samples.length === 0
        ) {

            return this.emptyResult(
                "No reference-fit samples were provided."
            );

        }

        const results = [];

        samples.forEach((sample, index) => {

            if (!sample) {
                return;
            }

            let guideData =
                sample.guide_json;

            if (
                typeof guideData === "string"
            ) {

                try {

                    guideData =
                        JSON.parse(
                            guideData
                        );

                } catch (error) {

                    guideData = null;

                }

            }

            const studentImage =
                sample.image_path;

            const referenceImage =
                guideData?.referenceImage ||
                null;

            if (
                !studentImage ||
                !referenceImage
            ) {

                results.push({

                    attemptIndex:
                        index,

                    score:
                        0,

                    classification:
                        "Needs Improvement",

                    overlapScore:
                        0,

                    coverageScore:
                        0,

                    distanceScore:
                        0,

                    outsideScore:
                        0,

                    valid:
                        false,

                    reason:
                        "Missing student or reference image.",

                });

                return;

            }

            const result =
                this.analyzeSingle({

                    studentImage,

                    referenceImage,

                    options,

                });

            results.push({

                attemptIndex:
                    index,

                ...result,

            });

        });


        const validResults =
            results.filter(
                result =>
                    result.valid
            );


        if (
            validResults.length === 0
        ) {

            return {

                ...this.emptyResult(
                    "No valid reference-fit samples were found."
                ),

                attemptDetails:
                    results,

            };

        }


        const score =
            this.average(
                validResults.map(
                    result =>
                        result.score
                )
            );


        const overlap =
            this.average(
                validResults.map(
                    result =>
                        result.overlapScore
                )
            );


        const coverage =
            this.average(
                validResults.map(
                    result =>
                        result.coverageScore
                )
            );


        const distance =
            this.average(
                validResults.map(
                    result =>
                        result.distanceScore
                )
            );


        const outside =
            this.average(
                validResults.map(
                    result =>
                        result.outsideScore
                )
            );


        return {

            score:
                Number(
                    score.toFixed(2)
                ),

            classification:
                this.classify(score),

            valid:
                true,

            attemptsAnalyzed:
                validResults.length,

            attemptDetails:
                results,

            componentScores: {

                overlap:
                    Number(
                        overlap.toFixed(2)
                    ),

                coverage:
                    Number(
                        coverage.toFixed(2)
                    ),

                position:
                    Number(
                        distance.toFixed(2)
                    ),

                outside:
                    Number(
                        outside.toFixed(2)
                    ),

            },

        };

    }


    // ==========================================================
    // ANALYZE ONE SAMPLE
    // ==========================================================

    static analyzeSingle({

        studentImage,

        referenceImage,

        options = {},

    } = {}) {

        try {

            const student =
                this.decodeImage(
                    studentImage
                );

            const reference =
                this.decodeImage(
                    referenceImage
                );


            if (!student) {

                return this.emptyResult(
                    "Could not decode student handwriting image."
                );

            }


            if (!reference) {

                return this.emptyResult(
                    "Could not decode reference image."
                );

            }


            const studentMask =
                this.createInkMask(
                    student,
                    {
                        ...options,
                        threshold:
                            Number.isFinite(
                                options.studentThreshold
                            )
                                ? options.studentThreshold
                                : 120,
                    }
                );
            
            const referenceMask =
                this.createInkMask(
                    reference,
                    {
                        ...options,
                        threshold:
                            Number.isFinite(
                                options.referenceThreshold
                            )
                                ? options.referenceThreshold
                                : 245,
                    }
                );


            const studentBounds =
                this.getInkBounds(
                    studentMask
                );


            const referenceBounds =
                this.getInkBounds(
                    referenceMask
                );


            if (!studentBounds) {

                return this.emptyResult(
                    "No student handwriting detected."
                );

            }


            if (!referenceBounds) {

                return this.emptyResult(
                    "No reference guide detected."
                );

            }


            /*
             * IMPORTANT
             *
             * preservePosition = true
             *
             * keeps both images in their original canvas
             * positions instead of cropping each one separately.
             *
             * This is what we want for Spacing and Stroke because
             * the student's writing must remain around the guide.
             *
             * Alignment keeps the previous behavior by default.
             */

            const normalized =
                options.preservePosition

                    ? this.normalizeMasksToCanvas(
                        studentMask,
                        referenceMask
                    )

                    : this.normalizeMasksToBounds(
                        studentMask,
                        referenceMask,
                        studentBounds,
                        referenceBounds
                    );


            // --------------------------------------------------
            // Distance Fit
            // --------------------------------------------------

            const distanceScore =
                this.calculateDistanceFit(
                    normalized.student,
                    normalized.reference,
                    options
                );


            // --------------------------------------------------
            // Reference Coverage
            // --------------------------------------------------

            const coverageScore =
                this.calculateReferenceCoverage(
                    normalized.student,
                    normalized.reference,
                    options
                );


            // --------------------------------------------------
            // Tolerance Overlap
            // --------------------------------------------------

            const overlapScore =
                this.calculateToleranceOverlap(
                    normalized.student,
                    normalized.reference,
                    options
                );


            // --------------------------------------------------
            // Outside Score
            // --------------------------------------------------

            const outsideScore =
                this.calculateOutsideScore(
                    normalized.student,
                    normalized.reference,
                    options
                );


            /*
             * FINAL SCORE
             *
             * Distance:
             * 40%
             *
             * Tolerance:
             * 30%
             *
             * Coverage:
             * 20%
             *
             * Outside:
             * 10%
             */

            const score =

                (
                    distanceScore *
                    0.40
                ) +

                (
                    overlapScore *
                    0.30
                ) +

                (
                    coverageScore *
                    0.20
                ) +

                (
                    outsideScore *
                    0.10
                );


            const finalScore =
                Math.max(
                    0,
                    Math.min(
                        100,
                        score
                    )
                );


            return {

                score:
                    Number(
                        finalScore.toFixed(2)
                    ),

                classification:
                    this.classify(
                        finalScore
                    ),

                overlapScore:
                    Number(
                        overlapScore.toFixed(2)
                    ),

                coverageScore:
                    Number(
                        coverageScore.toFixed(2)
                    ),

                distanceScore:
                    Number(
                        distanceScore.toFixed(2)
                    ),

                outsideScore:
                    Number(
                        outsideScore.toFixed(2)
                    ),

                valid:
                    true,

                studentInk:
                    studentBounds,

                referenceInk:
                    referenceBounds,

            };

        } catch (error) {

            console.error(
                "ReferenceFitAnalyzer error:",
                error
            );

            return this.emptyResult(
                error.message
            );

        }

    }


    // ==========================================================
    // DECODE IMAGE
    // ==========================================================

    static decodeImage(image) {

        try {

            let buffer;


            if (
                typeof image === "string" &&
                image.startsWith("data:image")
            ) {

                const commaIndex =
                    image.indexOf(",");


                if (
                    commaIndex === -1
                ) {

                    return null;

                }


                const base64 =
                    image.substring(
                        commaIndex + 1
                    );


                buffer =
                    Buffer.from(
                        base64,
                        "base64"
                    );

            }

            else if (
                Buffer.isBuffer(image)
            ) {

                buffer =
                    image;

            }

            else if (
                typeof image === "string"
            ) {

                buffer =
                    Buffer.from(
                        image,
                        "base64"
                    );

            }

            else {

                return null;

            }


            return PNG.sync.read(
                buffer
            );

        } catch (error) {

            console.error(
                "Reference image decode error:",
                error
            );

            return null;

        }

    }


    // ==========================================================
    // CREATE INK MASK
    // ==========================================================

    static createInkMask(
        image,
        options = {}
    ) {

        const width =
            image.width;

        const height =
            image.height;

        const data =
            image.data;


        const threshold =
            Number.isFinite(
                options.threshold
            )
                ? options.threshold
                : 120;


        const mask =
            new Uint8Array(
                width * height
            );


        for (
            let y = 0;
            y < height;
            y++
        ) {

            for (
                let x = 0;
                x < width;
                x++
            ) {

                const index =
                    (
                        y *
                        width +
                        x
                    ) * 4;


                const r =
                    data[index];

                const g =
                    data[index + 1];

                const b =
                    data[index + 2];

                const a =
                    data[index + 3];


                if (
                    a < 30
                ) {

                    continue;

                }


                const brightness =
                    (
                        r +
                        g +
                        b
                    ) / 3;


                if (
                    brightness <= threshold
                ) {

                    mask[
                        y *
                        width +
                        x
                    ] = 1;

                }

            }

        }


        return {

            width,

            height,

            data:
                mask,

        };

    }


    // ==========================================================
    // GET INK BOUNDS
    // ==========================================================

    static getInkBounds(mask) {

        const {
            width,
            height,
            data,
        } = mask;


        let minX =
            width;

        let minY =
            height;

        let maxX =
            -1;

        let maxY =
            -1;

        let pixelCount =
            0;


        for (
            let y = 0;
            y < height;
            y++
        ) {

            for (
                let x = 0;
                x < width;
                x++
            ) {

                if (
                    data[
                        y *
                        width +
                        x
                    ] !== 1
                ) {

                    continue;

                }


                pixelCount++;


                minX =
                    Math.min(
                        minX,
                        x
                    );


                minY =
                    Math.min(
                        minY,
                        y
                    );


                maxX =
                    Math.max(
                        maxX,
                        x
                    );


                maxY =
                    Math.max(
                        maxY,
                        y
                    );

            }

        }


        if (
            pixelCount === 0
        ) {

            return null;

        }


        return {

            left:
                minX,

            top:
                minY,

            right:
                maxX,

            bottom:
                maxY,

            width:
                maxX -
                minX +
                1,

            height:
                maxY -
                minY +
                1,

            pixelCount,

        };

    }


    // ==========================================================
    // NORMALIZE TO SAME CANVAS
    //
    // Used by Spacing and Stroke.
    //
    // We preserve the actual X/Y position of the writing.
    // ==========================================================

    static normalizeMasksToCanvas(
        student,
        reference
    ) {

        const targetWidth =
            Math.max(
                student.width,
                reference.width
            );


        const targetHeight =
            Math.max(
                student.height,
                reference.height
            );


        const studentNormalized =
            this.resizeMaskToCanvas(
                student,
                targetWidth,
                targetHeight
            );


        const referenceNormalized =
            this.resizeMaskToCanvas(
                reference,
                targetWidth,
                targetHeight
            );


        return {

            student:
                studentNormalized,

            reference:
                referenceNormalized,

        };

    }


    // ==========================================================
    // RESIZE MASK TO CANVAS
    // ==========================================================

    static resizeMaskToCanvas(
        mask,
        targetWidth,
        targetHeight
    ) {

        if (
            mask.width === targetWidth &&
            mask.height === targetHeight
        ) {

            return {

                width:
                    mask.width,

                height:
                    mask.height,

                data:
                    mask.data,

            };

        }


        const output =
            new Uint8Array(
                targetWidth *
                targetHeight
            );


        const scaleX =
            mask.width /
            targetWidth;


        const scaleY =
            mask.height /
            targetHeight;


        for (
            let y = 0;
            y < targetHeight;
            y++
        ) {

            const sourceY =
                Math.min(
                    mask.height - 1,
                    Math.floor(
                        y *
                        scaleY
                    )
                );


            for (
                let x = 0;
                x < targetWidth;
                x++
            ) {

                const sourceX =
                    Math.min(
                        mask.width - 1,
                        Math.floor(
                            x *
                            scaleX
                        )
                    );


                if (
                    mask.data[
                        sourceY *
                        mask.width +
                        sourceX
                    ]
                ) {

                    output[
                        y *
                        targetWidth +
                        x
                    ] = 1;

                }

            }

        }


        return {

            width:
                targetWidth,

            height:
                targetHeight,

            data:
                output,

        };

    }


    // ==========================================================
    // ORIGINAL ALIGNMENT NORMALIZATION
    //
    // Kept so the currently working Alignment analyzer does not
    // suddenly change behavior.
    // ==========================================================

    static normalizeMasksToBounds(
        student,
        reference,
        studentBounds,
        referenceBounds
    ) {

        const targetWidth =
            220;

        const targetHeight =
            220;


        const studentNormalized =
            this.resizeMaskToBounds(
                student,
                studentBounds,
                targetWidth,
                targetHeight
            );


        const referenceNormalized =
            this.resizeMaskToBounds(
                reference,
                referenceBounds,
                targetWidth,
                targetHeight
            );


        return {

            student:
                studentNormalized,

            reference:
                referenceNormalized,

        };

    }


    // ==========================================================
    // RESIZE/CROP MASK
    // ==========================================================

    static resizeMaskToBounds(
        mask,
        bounds,
        targetWidth,
        targetHeight
    ) {

        const output =
            new Uint8Array(
                targetWidth *
                targetHeight
            );


        const sourceWidth =
            bounds.width;

        const sourceHeight =
            bounds.height;


        for (
            let y = 0;
            y < targetHeight;
            y++
        ) {

            const sourceY =
                Math.min(
                    mask.height - 1,
                    bounds.top +
                    Math.floor(
                        (
                            y /
                            targetHeight
                        ) *
                        sourceHeight
                    )
                );


            for (
                let x = 0;
                x < targetWidth;
                x++
            ) {

                const sourceX =
                    Math.min(
                        mask.width - 1,
                        bounds.left +
                        Math.floor(
                            (
                                x /
                                targetWidth
                            ) *
                            sourceWidth
                        )
                    );


                const sourceIndex =
                    sourceY *
                    mask.width +
                    sourceX;


                if (
                    mask.data[
                        sourceIndex
                    ]
                ) {

                    output[
                        y *
                        targetWidth +
                        x
                    ] = 1;

                }

            }

        }


        return {

            width:
                targetWidth,

            height:
                targetHeight,

            data:
                output,

        };

    }


    // ==========================================================
    // TOLERANCE OVERLAP
    // ==========================================================

    static calculateToleranceOverlap(
        student,
        reference,
        options = {}
    ) {

        const radius =
            Number.isFinite(
                options.toleranceRadius
            )
                ? options.toleranceRadius
                : 8;


        let studentPixels =
            0;

        let matchedPixels =
            0;


        for (
            let y = 0;
            y < student.height;
            y++
        ) {

            for (
                let x = 0;
                x < student.width;
                x++
            ) {

                const studentIndex =
                    y *
                    student.width +
                    x;


                if (
                    !student.data[
                        studentIndex
                    ]
                ) {

                    continue;

                }


                studentPixels++;


                if (
                    this.hasNearbyPixel(
                        reference,
                        x,
                        y,
                        radius
                    )
                ) {

                    matchedPixels++;

                }

            }

        }


        if (
            studentPixels === 0
        ) {

            return 0;

        }


        return (
            matchedPixels /
            studentPixels
        ) * 100;

    }


    // ==========================================================
    // REFERENCE COVERAGE
    // ==========================================================

    static calculateReferenceCoverage(
        student,
        reference,
        options = {}
    ) {

        const radius =
            Number.isFinite(
                options.toleranceRadius
            )
                ? options.toleranceRadius
                : 8;


        let referencePixels =
            0;

        let coveredPixels =
            0;


        for (
            let y = 0;
            y < reference.height;
            y++
        ) {

            for (
                let x = 0;
                x < reference.width;
                x++
            ) {

                const index =
                    y *
                    reference.width +
                    x;


                if (
                    !reference.data[
                        index
                    ]
                ) {

                    continue;

                }


                referencePixels++;


                if (
                    this.hasNearbyPixel(
                        student,
                        x,
                        y,
                        radius
                    )
                ) {

                    coveredPixels++;

                }

            }

        }


        if (
            referencePixels === 0
        ) {

            return 0;

        }


        return (
            coveredPixels /
            referencePixels
        ) * 100;

    }


    // ==========================================================
    // DISTANCE FIT
    // ==========================================================

    static calculateDistanceFit(
        student,
        reference,
        options = {}
    ) {

        const maxDistance =
            Number.isFinite(
                options.maxDistance
            )
                ? options.maxDistance
                : 20;


        let totalDistance =
            0;

        let pixelCount =
            0;


        for (
            let y = 0;
            y < student.height;
            y++
        ) {

            for (
                let x = 0;
                x < student.width;
                x++
            ) {

                const index =
                    y *
                    student.width +
                    x;


                if (
                    !student.data[
                        index
                    ]
                ) {

                    continue;

                }


                pixelCount++;


                const distance =
                    this.findNearestDistance(
                        reference,
                        x,
                        y,
                        maxDistance
                    );


                totalDistance +=
                    distance;

            }

        }


        if (
            pixelCount === 0
        ) {

            return 0;

        }


        const averageDistance =
            totalDistance /
            pixelCount;


        const score =
            100 *
            Math.max(
                0,
                1 -
                (
                    averageDistance /
                    maxDistance
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
    // OUTSIDE SCORE
    // ==========================================================

    static calculateOutsideScore(
        student,
        reference,
        options = {}
    ) {

        const radius =
            Number.isFinite(
                options.toleranceRadius
            )
                ? options.toleranceRadius
                : 8;


        let studentPixels =
            0;

        let outsidePixels =
            0;


        for (
            let y = 0;
            y < student.height;
            y++
        ) {

            for (
                let x = 0;
                x < student.width;
                x++
            ) {

                const index =
                    y *
                    student.width +
                    x;


                if (
                    !student.data[
                        index
                    ]
                ) {

                    continue;

                }


                studentPixels++;


                if (
                    !this.hasNearbyPixel(
                        reference,
                        x,
                        y,
                        radius
                    )
                ) {

                    outsidePixels++;

                }

            }

        }


        if (
            studentPixels === 0
        ) {

            return 0;

        }


        const outsideRatio =
            outsidePixels /
            studentPixels;


        return (
            1 -
            outsideRatio
        ) * 100;

    }


    // ==========================================================
    // FIND NEAREST DISTANCE
    // ==========================================================

    static findNearestDistance(
        mask,
        x,
        y,
        maxDistance
    ) {

        const radius =
            Math.ceil(
                maxDistance
            );


        let bestDistance =
            maxDistance;


        for (
            let dy = -radius;
            dy <= radius;
            dy++
        ) {

            const yy =
                y + dy;


            if (
                yy < 0 ||
                yy >= mask.height
            ) {

                continue;

            }


            for (
                let dx = -radius;
                dx <= radius;
                dx++
            ) {

                const xx =
                    x + dx;


                if (
                    xx < 0 ||
                    xx >= mask.width
                ) {

                    continue;

                }


                if (
                    !mask.data[
                        yy *
                        mask.width +
                        xx
                    ]
                ) {

                    continue;

                }


                const distance =
                    Math.sqrt(
                        (
                            dx *
                            dx
                        ) +
                        (
                            dy *
                            dy
                        )
                    );


                if (
                    distance <
                    bestDistance
                ) {

                    bestDistance =
                        distance;

                }


                if (
                    bestDistance === 0
                ) {

                    return 0;

                }

            }

        }


        return bestDistance;

    }


    // ==========================================================
    // CHECK NEARBY PIXEL
    // ==========================================================

    static hasNearbyPixel(
        mask,
        x,
        y,
        radius
    ) {

        const radiusSquared =
            radius *
            radius;


        for (
            let dy = -radius;
            dy <= radius;
            dy++
        ) {

            const yy =
                y + dy;


            if (
                yy < 0 ||
                yy >= mask.height
            ) {

                continue;

            }


            for (
                let dx = -radius;
                dx <= radius;
                dx++
            ) {

                const xx =
                    x + dx;


                if (
                    xx < 0 ||
                    xx >= mask.width
                ) {

                    continue;

                }


                if (
                    (
                        dx *
                        dx
                    ) +
                    (
                        dy *
                        dy
                    ) >
                    radiusSquared
                ) {

                    continue;

                }


                if (
                    mask.data[
                        yy *
                        mask.width +
                        xx
                    ]
                ) {

                    return true;

                }

            }

        }


        return false;

    }


    // ==========================================================
    // AVERAGE
    // ==========================================================

    static average(values) {

        if (
            !Array.isArray(values) ||
            values.length === 0
        ) {

            return 0;

        }


        const total =
            values.reduce(
                (
                    sum,
                    value
                ) => {

                    return (
                        sum +
                        (
                            Number(value) ||
                            0
                        )
                    );

                },
                0
            );


        return (
            total /
            values.length
        );

    }


    // ==========================================================
    // CLASSIFICATION
    // ==========================================================

    static classify(score) {

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
    // EMPTY RESULT
    // ==========================================================

    static emptyResult(reason) {

        return {

            score:
                0,

            classification:
                "Needs Improvement",

            overlapScore:
                0,

            coverageScore:
                0,

            distanceScore:
                0,

            outsideScore:
                0,

            valid:
                false,

            reason:
                reason ||
                "Reference fit analysis could not be completed.",

        };

    }

}


module.exports =
    ReferenceFitAnalyzer;