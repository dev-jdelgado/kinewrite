// ======================================================
// StrokeMetrics
// Calculates basic handwriting stroke metrics
// ======================================================

const StrokeMetrics = {

    calculate(handwritingData) {

        if (!handwritingData || handwritingData.length === 0) {

            return {

                strokeCount: 0,
                totalPoints: 0,
                penLifts: 0,
                averagePointsPerStroke: 0,
                longestStroke: 0,
                shortestStroke: 0,

            };
        }

        const strokeCount = handwritingData.length;

        let totalPoints = 0;
        let longestStroke = 0;
        let shortestStroke = Infinity;

        handwritingData.forEach((stroke) => {

            const points = stroke.length;

            totalPoints += points;

            if (points > longestStroke) {
                longestStroke = points;
            }

            if (points < shortestStroke) {
                shortestStroke = points;
            }

        });

        return {

            strokeCount,
            totalPoints,

            penLifts:
                strokeCount > 0
                    ? strokeCount - 1
                    : 0,

            averagePointsPerStroke:
                Number(
                    (
                        totalPoints /
                        strokeCount
                    ).toFixed(2)
                ),

            longestStroke,
            shortestStroke,

        };
    },
};

export default StrokeMetrics;