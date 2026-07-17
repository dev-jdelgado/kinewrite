const FeatureExtractor = require("./FeatureExtractor");
const Geometry = require("./Geometry");

class StrokeCluster {

    // ==========================================
    // Cluster Strokes
    // ==========================================

    static cluster(strokes) {

        if (!Array.isArray(strokes) || strokes.length === 0) {
            return [];
        }

        const features =
            FeatureExtractor.extract(strokes);

        const items =
            [...features.strokeFeatures];

        // Sort from left to right
        items.sort(
            (a, b) => a.centerX - b.centerX
        );

        const clusters = [];

        items.forEach(item => {

            const cluster =
                this.findMatchingCluster(
                    clusters,
                    item
                );

            if (cluster) {

                cluster.strokes.push(item.stroke);
                cluster.features.push(item);

                cluster.boundingBox =
                    this.mergeBoundingBoxes(
                        cluster.boundingBox,
                        item.boundingBox
                    );

                cluster.lastTimestamp =
                    this.getLastTimestamp(item.stroke);

            } else {

                clusters.push({

                    strokes: [item.stroke],

                    features: [item],

                    boundingBox: item.boundingBox,

                    firstTimestamp:
                        this.getFirstTimestamp(item.stroke),

                    lastTimestamp:
                        this.getLastTimestamp(item.stroke),

                });

            }

        });

        return clusters.map(cluster => ({

            strokes:
                cluster.strokes,

            strokeCount:
                cluster.strokes.length,

            boundingBox:
                cluster.boundingBox,

            centerX:
                (cluster.boundingBox.minX +
                    cluster.boundingBox.maxX) / 2,

            centerY:
                (cluster.boundingBox.minY +
                    cluster.boundingBox.maxY) / 2,

        }));

    }

    // ==========================================
    // Find Existing Cluster
    // ==========================================

    static findMatchingCluster(
        clusters,
        feature
    ) {

        const MAX_DISTANCE = 35;
        const MAX_TIME_GAP = 500;

        for (const cluster of clusters) {

            const horizontalGap =
                feature.boundingBox.minX -
                cluster.boundingBox.maxX;

            const verticalGap =
                Math.abs(
                    feature.centerY -
                    (
                        (cluster.boundingBox.minY +
                         cluster.boundingBox.maxY) / 2
                    )
                );

            const timeGap =
                this.getFirstTimestamp(feature.stroke) -
                cluster.lastTimestamp;

            const closeHorizontally =
                horizontalGap <= MAX_DISTANCE;

            const closeVertically =
                verticalGap <= 40;

            const closeInTime =
                timeGap <= MAX_TIME_GAP;

            if (
                closeHorizontally &&
                closeVertically &&
                closeInTime
            ) {

                return cluster;

            }

        }

        return null;

    }

    // ==========================================
    // Merge Bounding Boxes
    // ==========================================

    static mergeBoundingBoxes(a, b) {

        return {

            minX: Math.min(a.minX, b.minX),
            maxX: Math.max(a.maxX, b.maxX),
            minY: Math.min(a.minY, b.minY),
            maxY: Math.max(a.maxY, b.maxY),

            width:
                Math.max(a.maxX, b.maxX) -
                Math.min(a.minX, b.minX),

            height:
                Math.max(a.maxY, b.maxY) -
                Math.min(a.minY, b.minY),

        };

    }

    // ==========================================
    // First Timestamp
    // ==========================================

    static getFirstTimestamp(stroke) {

        if (!stroke.length) return 0;

        return stroke[0].timestamp || 0;

    }

    // ==========================================
    // Last Timestamp
    // ==========================================

    static getLastTimestamp(stroke) {

        if (!stroke.length) return 0;

        return stroke[
            stroke.length - 1
        ].timestamp || 0;

    }

}

module.exports = StrokeCluster;