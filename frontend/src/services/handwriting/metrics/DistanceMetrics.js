// ======================================================
// DistanceMetrics
// Calculates handwriting movement distance
// ======================================================

const DistanceMetrics = {

    calculate(handwritingData) {

        if (!handwritingData || handwritingData.length === 0) {

            return {

                totalDistance: 0,
                averageStrokeDistance: 0,
                longestStrokeDistance: 0,
                shortestStrokeDistance: 0,

            };
        }

        let totalDistance = 0;
        let longestStrokeDistance = 0;
        let shortestStrokeDistance = Infinity;

        handwritingData.forEach((stroke) => {

            if (stroke.length < 2) return;

            let strokeDistance = 0;

            for (let i = 1; i < stroke.length; i++) {

                const previous = stroke[i - 1];
                const current = stroke[i];
                const dx = current.x - previous.x;
                const dy = current.y - previous.y;

                strokeDistance += Math.sqrt(
                    (dx * dx) +
                    (dy * dy)
                );
            }

            totalDistance += strokeDistance;

            if (strokeDistance > longestStrokeDistance) {
                longestStrokeDistance = strokeDistance;
            }

            if (strokeDistance < shortestStrokeDistance) {
                shortestStrokeDistance = strokeDistance;
            }
        });

        if (shortestStrokeDistance === Infinity) {
            shortestStrokeDistance = 0;
        }

        return {

            totalDistance: Number(
                totalDistance.toFixed(2)
            ),

            averageStrokeDistance: Number(
                (
                    totalDistance /
                    handwritingData.length
                ).toFixed(2)
            ),

            longestStrokeDistance: Number(
                longestStrokeDistance.toFixed(2)
            ),

            shortestStrokeDistance: Number(
                shortestStrokeDistance.toFixed(2)
            ),

        };
    },
};

export default DistanceMetrics;