// ======================================================
// BoundingBoxMetrics
// Calculates the handwriting bounding box and workspace
// utilization metrics.
// ======================================================

const BoundingBoxMetrics = {

    calculate(handwritingData) {

        if (!handwritingData || handwritingData.length === 0) {

            return {

                minX: 0,
                maxX: 0,
                minY: 0,
                maxY: 0,

                width: 0,
                height: 0,

                area: 0,

                centerX: 0,
                centerY: 0,

                aspectRatio: 0,

            };

        }

        const xValues = [];
        const yValues = [];

        handwritingData.forEach((stroke) => {

            stroke.forEach((point) => {

                xValues.push(point.x);
                yValues.push(point.y);

            });

        });

        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);

        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);

        const width = maxX - minX;
        const height = maxY - minY;

        const area = width * height;

        const centerX = minX + (width / 2);
        const centerY = minY + (height / 2);

        const aspectRatio =
            height === 0
                ? 0
                : Number((width / height).toFixed(2));

        return {

            minX,
            maxX,

            minY,
            maxY,

            width: Number(width.toFixed(2)),
            height: Number(height.toFixed(2)),

            area: Number(area.toFixed(2)),

            centerX: Number(centerX.toFixed(2)),
            centerY: Number(centerY.toFixed(2)),

            aspectRatio,

        };
    },
};

export default BoundingBoxMetrics;