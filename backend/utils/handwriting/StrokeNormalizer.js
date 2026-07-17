class StrokeNormalizer {

    // ==========================================
    // Normalize Stroke Collection
    // ==========================================

    static normalize(strokes) {

        if (!Array.isArray(strokes)) {
            return [];
        }

        return strokes
            .map(stroke => this.normalizeStroke(stroke))
            .filter(stroke => stroke.length >= 2);

    }

    // ==========================================
    // Normalize Single Stroke
    // ==========================================

    static normalizeStroke(stroke) {

        if (!Array.isArray(stroke)) {
            return [];
        }

        const cleaned = [];

        for (const point of stroke) {

            if (!point) continue;

            if (cleaned.length === 0) {

                cleaned.push(point);
                continue;

            }

            const previous = cleaned[cleaned.length - 1];

            const dx = point.x - previous.x;
            const dy = point.y - previous.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            // Ignore duplicate points

            if (distance < 0.5) {
                continue;
            }

            cleaned.push(point);

        }

        return cleaned;

    }

}

module.exports = StrokeNormalizer;