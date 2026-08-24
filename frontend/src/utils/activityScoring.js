const clamp = (value, min = 0, max = 100) =>
    Math.max(min, Math.min(max, value));

const mean = values =>
    values.length
        ? values.reduce((a, b) => a + b, 0) / values.length
        : 0;

const stdDev = values => {
    if (!values.length) return 0;
    const m = mean(values);
    return Math.sqrt(mean(values.map(v => (v - m) ** 2)));
};

const flatten = strokes => strokes.flatMap(s => s || []);

const distance = (a, b) =>
    Math.hypot((b.x || 0) - (a.x || 0), (b.y || 0) - (a.y || 0));

const pathLength = stroke => {
    let total = 0;
    for (let i = 1; i < stroke.length; i++) total += distance(stroke[i - 1], stroke[i]);
    return total;
};

const getBoxes = strokes => strokes
    .filter(s => s?.length > 1)
    .map(points => {
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        return {
            left: Math.min(...xs),
            right: Math.max(...xs),
            top: Math.min(...ys),
            bottom: Math.max(...ys),
            width: Math.max(1, Math.max(...xs) - Math.min(...xs)),
            height: Math.max(1, Math.max(...ys) - Math.min(...ys)),
        };
    });

const spacingScore = strokes => {
    const boxes = getBoxes(strokes).sort((a, b) => a.left - b.left);
    if (boxes.length < 2) return 72;

    const gaps = [];
    for (let i = 1; i < boxes.length; i++) {
        gaps.push(Math.max(0, boxes[i].left - boxes[i - 1].right));
    }

    const m = mean(gaps);
    if (m <= 1) return 45;

    const cv = stdDev(gaps) / m;
    return clamp(100 - cv * 85);
};

const alignmentScore = strokes => {
    const boxes = getBoxes(strokes);
    if (!boxes.length) return 0;

    const bottoms = boxes.map(b => b.bottom);
    const heights = boxes.map(b => b.height);
    const baselineVariation = stdDev(bottoms) / Math.max(1, mean(heights));
    const sizeVariation = stdDev(heights) / Math.max(1, mean(heights));

    return clamp(
        100 - baselineVariation * 90 - sizeVariation * 25
    );
};

const smoothnessScore = strokes => {
    const angles = [];
    const lengths = [];

    strokes.forEach(stroke => {
        lengths.push(pathLength(stroke));
        for (let i = 2; i < stroke.length; i++) {
            const a = stroke[i - 2];
            const b = stroke[i - 1];
            const c = stroke[i];
            const a1 = Math.atan2(b.y - a.y, b.x - a.x);
            const a2 = Math.atan2(c.y - b.y, c.x - b.x);
            let delta = Math.abs(a2 - a1);
            if (delta > Math.PI) delta = 2 * Math.PI - delta;
            angles.push(delta);
        }
    });

    const turn = mean(angles);
    const tinySegments = lengths.filter(v => v < 3).length;
    const fragmentation = lengths.length
        ? tinySegments / lengths.length
        : 1;

    return clamp(100 - turn * 30 - fragmentation * 35);
};

const traceShapeScore = (prompt, strokes) => {
    const points = flatten(strokes);
    if (points.length < 2) return 0;

    const first = points[0];
    const last = points[points.length - 1];
    const allX = points.map(p => p.x);
    const allY = points.map(p => p.y);
    const w = Math.max(...allX) - Math.min(...allX);
    const h = Math.max(...allY) - Math.min(...allY);
    const closeDistance = Math.hypot(last.x - first.x, last.y - first.y);
    const diagonal = Math.max(1, Math.hypot(w, h));

    const closure = clamp(100 - (closeDistance / diagonal) * 120);
    const aspect = w / Math.max(1, h);

    if (["Circle", "Oval", "Heart", "Spiral"].includes(prompt)) {
        return clamp(closure * 0.65 + smoothnessScore(strokes) * 0.35);
    }

    if (["Square", "Rectangle", "Triangle", "Diamond"].includes(prompt)) {
        return clamp(closure * 0.55 + smoothnessScore(strokes) * 0.45);
    }

    return smoothnessScore(strokes);
};

const traceLineScore = (prompt, strokes) => {
    const points = flatten(strokes);
    if (points.length < 2) return 0;

    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const dx = Math.max(...xs) - Math.min(...xs);
    const dy = Math.max(...ys) - Math.min(...ys);
    const diagonal = Math.max(1, Math.hypot(dx, dy));

    if (prompt === "Horizontal") {
        return clamp(100 - (dy / diagonal) * 100);
    }
    if (prompt === "Vertical") {
        return clamp(100 - (dx / diagonal) * 100);
    }
    if (prompt === "Diagonal") {
        const ratio = Math.min(dx, dy) / Math.max(dx, dy, 1);
        return clamp(ratio * 100);
    }

    return smoothnessScore(strokes);
};

const expectedLetterStrokes = {
    A: 3, B: 4, C: 1, D: 3, E: 4,
    F: 3, G: 2, H: 3, I: 3, J: 2,
    M: 4, N: 3, R: 4, S: 1, W: 4,
};

const letterScore = (letter, strokes) => {
    const expected = expectedLetterStrokes[letter?.toUpperCase()];
    const countScore = expected
        ? clamp(100 - Math.abs(strokes.length - expected) * 22)
        : 75;

    const size = getBoxes(strokes);
    const sizeScore = size.length ? clamp(100 - (stdDev(size.map(b => b.height)) / Math.max(1, mean(size.map(b => b.height))) * 40)) : 0;

    return clamp(countScore * 0.45 + alignmentScore(strokes) * 0.25 + smoothnessScore(strokes) * 0.20 + sizeScore * 0.10);
};

export const calculateActivityScore = ({ category, mode, prompt, strokes }) => {
    if (!Array.isArray(strokes) || !strokes.some(s => s?.length > 1)) {
        return { score: 0, stars: 0, metrics: {} };
    }

    let score;
    const metrics = {
        strokeCount: strokes.length,
        pointCount: flatten(strokes).length,
        penLifts: Math.max(0, strokes.length - 1),
        spacing: spacingScore(strokes),
        alignment: alignmentScore(strokes),
        smoothness: smoothnessScore(strokes),
    };

    if (category === "spacing") {
        score = metrics.spacing * 0.65 + metrics.alignment * 0.20 + metrics.smoothness * 0.15;
    } else if (category === "alignment") {
        score = metrics.alignment * 0.65 + metrics.smoothness * 0.20 + metrics.spacing * 0.15;
        if (mode === "stay-box") score = Math.min(score + 5, 100);
        if (mode === "alignment-path") score = metrics.alignment * 0.75 + metrics.smoothness * 0.25;
    } else if (mode === "trace-line") {
        score = traceLineScore(prompt, strokes) * 0.75 + metrics.smoothness * 0.25;
    } else if (mode === "trace-shape") {
        score = traceShapeScore(prompt, strokes);
    } else if (mode === "trace-letter" || mode === "write-letter") {
        score = letterScore(prompt, strokes);
    } else {
        score = metrics.smoothness * 0.40 + metrics.alignment * 0.35 + metrics.spacing * 0.25;
    }

    score = Number(clamp(score).toFixed(2));
    const stars = score >= 90 ? 3 : score >= 75 ? 2 : score >= 60 ? 1 : 0;

    return { score, stars, metrics };
};

export default calculateActivityScore;
