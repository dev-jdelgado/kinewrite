class Geometry {

    // ==========================================
    // Distance Between Two Points
    // ==========================================

    static distance(pointA, pointB) {

        const dx = pointB.x - pointA.x;

        const dy = pointB.y - pointA.y;

        return Math.sqrt(

            (dx * dx) +

            (dy * dy)

        );

    }

    // ==========================================
    // Total Stroke Length
    // ==========================================

    static strokeLength(stroke) {

        if (!stroke || stroke.length < 2) {

            return 0;

        }

        let length = 0;

        for (

            let i = 1;

            i < stroke.length;

            i++

        ) {

            length += Geometry.distance(

                stroke[i - 1],

                stroke[i]

            );

        }

        return length;

    }

    // ==========================================
    // Bounding Box
    // ==========================================

    static boundingBox(strokes) {

        const points = strokes.flat();

        if (!points.length) {

            return null;

        }

        const xs = points.map(

            point => point.x

        );

        const ys = points.map(

            point => point.y

        );

        return {

            minX: Math.min(...xs),

            maxX: Math.max(...xs),

            minY: Math.min(...ys),

            maxY: Math.max(...ys),

            width:

                Math.max(...xs) -

                Math.min(...xs),

            height:

                Math.max(...ys) -

                Math.min(...ys),

        };

    }

    // ==========================================
    // Average Point
    // ==========================================

    static averagePoint(strokes) {

        const points = strokes.flat();

        if (!points.length) {

            return {

                x: 0,

                y: 0,

            };

        }

        const sum = points.reduce(

            (total, point) => ({

                x: total.x + point.x,

                y: total.y + point.y,

            }),

            {

                x: 0,

                y: 0,

            }

        );

        return {

            x: sum.x / points.length,

            y: sum.y / points.length,

        };

    }

    // ==========================================
    // Average Stroke Length
    // ==========================================

    static averageStrokeLength(strokes) {

        if (!strokes.length) {

            return 0;

        }

        const total = strokes.reduce(

            (sum, stroke) =>

                sum +

                Geometry.strokeLength(stroke),

            0

        );

        return total / strokes.length;

    }

}

module.exports = Geometry;