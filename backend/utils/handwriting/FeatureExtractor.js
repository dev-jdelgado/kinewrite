const Geometry = require("./Geometry");

class FeatureExtractor {

    // ==========================================
    // Extract Features
    // ==========================================

    static extract(strokes) {

        if (!Array.isArray(strokes) || strokes.length === 0) {
            return {
                strokeFeatures: [],
                overallBoundingBox: null,
                averageWidth: 0,
                averageHeight: 0,
                averageBaseline: 0,
                averageCenterX: 0,
                averageCenterY: 0,
                totalStrokeLength: 0,
                totalPoints: 0,
            };
        }

        const strokeFeatures = [];
        let totalWidth = 0;
        let totalHeight = 0;
        let totalBaseline = 0;
        let totalCenterX = 0;
        let totalCenterY = 0;
        let totalStrokeLength = 0;
        let totalPoints = 0;

        strokes.forEach((stroke) => {

            if (!stroke.length) return;

            const box = Geometry.boundingBox([stroke]);

            if (!box) return;

            const width = box.maxX - box.minX;
            const height = box.maxY - box.minY;

            const centerX = (box.minX + box.maxX) / 2;
            const centerY = (box.minY + box.maxY) / 2;

            const baseline = box.maxY;

            const strokeLength =
                Geometry.strokeLength(stroke);

            const feature = {

                stroke,

                boundingBox: box,

                width,

                height,

                centerX,

                centerY,

                baseline,

                strokeLength,

                pointCount: stroke.length,

                firstPoint: stroke[0],

                lastPoint: stroke[stroke.length - 1],

            };

            strokeFeatures.push(feature);

            totalWidth += width;
            totalHeight += height;
            totalBaseline += baseline;
            totalCenterX += centerX;
            totalCenterY += centerY;
            totalStrokeLength += strokeLength;
            totalPoints += stroke.length;

        });

        const overallBoundingBox =
            Geometry.boundingBox(strokes);

        const count = strokeFeatures.length || 1;

        return {

            strokeFeatures,

            overallBoundingBox,

            averageWidth:
                totalWidth / count,

            averageHeight:
                totalHeight / count,

            averageBaseline:
                totalBaseline / count,

            averageCenterX:
                totalCenterX / count,

            averageCenterY:
                totalCenterY / count,

            totalStrokeLength,

            totalPoints,

            strokeCount:
                strokeFeatures.length,

        };

    }

}

module.exports = FeatureExtractor;