// ======================================================
// TimeMetrics
// Calculates handwriting timing metrics
// ======================================================

const TimeMetrics = {

    calculate(handwritingData) {

        if (!handwritingData || handwritingData.length === 0) {

            return {

                startedAt: null,
                endedAt: null,
                totalMilliseconds: 0,
                totalSeconds: 0,
                averageStrokeDuration: 0,

            };

        }

        let firstTimestamp = null;
        let lastTimestamp = null;
        let totalStrokeDuration = 0;

        handwritingData.forEach((stroke) => {

            if (stroke.length === 0) return;

            const strokeStart = stroke[0].timestamp;

            const strokeEnd =
                stroke[stroke.length - 1].timestamp;

            if (
                firstTimestamp === null ||
                strokeStart < firstTimestamp
            ) {
                firstTimestamp = strokeStart;
            }

            if (
                lastTimestamp === null ||
                strokeEnd > lastTimestamp
            ) {
                lastTimestamp = strokeEnd;
            }

            totalStrokeDuration +=
                strokeEnd - strokeStart;

        });

        const totalMilliseconds =
            lastTimestamp - firstTimestamp;

        return {

            startedAt: firstTimestamp,
            endedAt: lastTimestamp,
            totalMilliseconds,
            totalSeconds:

                Number(
                    (
                        totalMilliseconds / 1000
                    ).toFixed(2)
                ),

            averageStrokeDuration:

                Number(
                    (
                        totalStrokeDuration /
                        handwritingData.length /
                        1000
                    ).toFixed(2)
                ),
        };
    },
};

export default TimeMetrics;