const StrokeCluster = require("./StrokeCluster");
const FeatureExtractor = require("./FeatureExtractor");

class LetterSegmenter {

    // ==========================================
    // Segment Handwriting Into Letters
    // ==========================================

    static segment(strokes, expectedLetters = null) {

        if (!Array.isArray(strokes) || strokes.length === 0) {
            return [];
        }

        // ------------------------------------------
        // Step 1: Cluster nearby strokes
        // ------------------------------------------

        let clusters = StrokeCluster.cluster(strokes);

        // Sort left to right

        clusters.sort(
            (a, b) => a.centerX - b.centerX
        );

        // ------------------------------------------
        // Step 2: Match Expected Letter Count
        // ------------------------------------------

        if (
            expectedLetters &&
            expectedLetters > 0
        ) {

            clusters = this.adjustClusterCount(
                clusters,
                expectedLetters
            );

        }

        // ------------------------------------------
        // Step 3: Convert to Letter Objects
        // ------------------------------------------

        return clusters.map((cluster, index) => {

            const features =
                FeatureExtractor.extract(
                    cluster.strokes
                );

            return {

                letterIndex: index,

                strokes:
                    cluster.strokes,

                strokeCount:
                    cluster.strokeCount,

                boundingBox:
                    features.overallBoundingBox,

                centerX:
                    features.averageCenterX,

                centerY:
                    features.averageCenterY,

                width:
                    features.averageWidth,

                height:
                    features.averageHeight,

                baseline:
                    features.averageBaseline,

                totalStrokeLength:
                    features.totalStrokeLength,

                pointCount:
                    features.totalPoints,

            };

        });

    }

    // ==========================================
    // Adjust Cluster Count
    // ==========================================

    static adjustClusterCount(
        clusters,
        expectedLetters
    ) {

        let result = [...clusters];

        // ------------------------------------------
        // Too Many Clusters
        // Merge nearest clusters
        // ------------------------------------------

        while (
            result.length > expectedLetters
        ) {

            let bestIndex = 0;
            let smallestGap = Infinity;

            for (
                let i = 1;
                i < result.length;
                i++
            ) {

                const gap =
                    result[i].boundingBox.minX -
                    result[i - 1].boundingBox.maxX;

                if (gap < smallestGap) {

                    smallestGap = gap;
                    bestIndex = i;

                }

            }

            const left =
                result[bestIndex - 1];

            const right =
                result[bestIndex];

            left.strokes.push(
                ...right.strokes
            );

            left.strokeCount =
                left.strokes.length;

            const merged =
                FeatureExtractor.extract(
                    left.strokes
                );

            left.boundingBox =
                merged.overallBoundingBox;

            left.centerX =
                merged.averageCenterX;

            left.centerY =
                merged.averageCenterY;

            result.splice(bestIndex, 1);

        }

        // ------------------------------------------
        // Too Few Clusters
        // Split largest cluster
        // ------------------------------------------

        while (
            result.length < expectedLetters
        ) {

            let largestIndex = 0;
            let widest = 0;

            result.forEach(
                (cluster, index) => {

                    const width =
                        cluster.boundingBox.width;

                    if (width > widest) {

                        widest = width;
                        largestIndex = index;

                    }

                }
            );

            const target =
                result[largestIndex];

            if (
                target.strokes.length < 2
            ) {

                break;

            }

            const half =
                Math.ceil(
                    target.strokes.length / 2
                );

            const leftStrokes =
                target.strokes.slice(
                    0,
                    half
                );

            const rightStrokes =
                target.strokes.slice(
                    half
                );

            const leftFeature =
                FeatureExtractor.extract(
                    leftStrokes
                );

            const rightFeature =
                FeatureExtractor.extract(
                    rightStrokes
                );

            result.splice(
                largestIndex,
                1,

                {

                    strokes:
                        leftStrokes,

                    strokeCount:
                        leftStrokes.length,

                    boundingBox:
                        leftFeature.overallBoundingBox,

                    centerX:
                        leftFeature.averageCenterX,

                    centerY:
                        leftFeature.averageCenterY,

                },

                {

                    strokes:
                        rightStrokes,

                    strokeCount:
                        rightStrokes.length,

                    boundingBox:
                        rightFeature.overallBoundingBox,

                    centerX:
                        rightFeature.averageCenterX,

                    centerY:
                        rightFeature.averageCenterY,

                }

            );

        }

        return result;

    }

}

module.exports = LetterSegmenter;