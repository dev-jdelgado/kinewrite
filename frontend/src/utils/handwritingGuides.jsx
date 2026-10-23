// src/utils/handwritingGuides.jsx

export const singleStrokeGlyphs = {
    A: "M50 0 L0 100 M50 0 L100 100 M20 65 L80 65",
    B: "M0 0 L0 100 M0 0 C65 0 85 12 85 25 C85 40 65 50 0 50 M0 50 C65 50 85 62 85 75 C85 90 65 100 0 100",
    C: "M100 10 C20 -10 0 30 0 50 C0 70 20 110 100 90",
    D: "M0 0 L0 100 M0 0 C65 0 100 20 100 50 C100 80 65 100 0 100",
    E: "M0 0 L100 0 M0 0 L0 100 M0 50 L75 50 M0 100 L100 100",
    F: "M0 0 L0 100 M0 0 L100 0 M0 50 L75 50",
    G: "M100 15 C20 -10 0 25 0 50 C0 80 25 100 65 100 C85 100 100 85 100 65 L100 55 L60 55",
    H: "M0 0 L0 100 M100 0 L100 100 M0 50 L100 50",
    I: "M0 0 L100 0 M50 0 L50 100 M0 100 L100 100",
    J: "M100 0 L100 75 C100 110 0 110 0 75",
    K: "M0 0 L0 100 M100 0 L0 50 M0 50 L100 100",
    L: "M0 0 L0 100 L100 100",
    M: "M0 100 L0 0 M0 0 L50 55 M50 55 L100 0 M100 0 L100 100",
    N: "M0 100 L0 0 M0 0 L100 100 M100 100 L100 0",
    O: "M50 0 C15 0 0 20 0 50 C0 80 15 100 50 100 C85 100 100 80 100 50 C100 20 85 0 50 0",
    P: "M0 100 L0 0 M0 0 C65 0 90 10 90 32 C90 53 65 62 0 62",
    Q: "M50 0 C20 0 0 20 0 50 C0 80 20 100 50 100 C80 100 100 80 100 50 C100 20 80 0 50 0 M62 68 L100 100",
    R: "M0 100 L0 0 M0 0 C65 0 90 10 90 32 C90 53 65 62 0 62 M48 62 L100 100",
    S: "M90 10 C20 -10 0 25 50 50 C100 75 80 110 10 90",
    T: "M0 0 L100 0 M50 0 L50 100",
    U: "M0 0 L0 70 C0 110 100 110 100 70 L100 0",
    V: "M0 0 L50 100 L100 0",
    W: "M0 0 L25 100 L50 45 L75 100 L100 0",
    X: "M0 0 L100 100 M100 0 L0 100",
    Y: "M0 0 L50 50 M100 0 L50 50 M50 50 L50 100",
    Z: "M0 0 L100 0 M100 0 L0 100 M0 100 L100 100",

    // Lowercase print letters with simple stroke paths for tracing.
    a: "M80 45 C70 25 35 25 20 45 C5 65 20 90 45 90 C65 90 80 75 80 55 M80 55 L80 90",
    b: "M15 10 L15 90 M15 60 C20 35 65 30 80 55 C95 80 65 95 40 88 C25 84 15 72 15 60",
    c: "M80 42 C65 25 35 30 20 50 C5 75 30 95 60 88 C70 85 75 80 80 75",
    d: "M80 10 L80 90 M80 60 C70 30 35 30 20 50 C5 75 30 95 60 88 C72 84 80 72 80 60",
    e: "M20 60 L80 60 C80 35 45 25 25 45 C5 65 20 90 50 90 C65 90 75 84 80 78",
    f: "M70 10 C40 5 35 25 35 45 L35 90 M15 45 L60 45",
    g: "M80 45 C65 25 35 30 20 50 C5 75 30 95 60 88 C72 84 80 72 80 55 M80 55 L80 90 C80 110 45 110 25 98",
    h: "M15 10 L15 90 M15 58 C25 30 75 30 80 58 L80 90",
    i: "M50 40 L50 90 M50 10 L50 12",
    j: "M65 40 L65 95 C65 110 45 110 35 100 M65 10 L65 12",
    k: "M20 10 L20 90 M80 40 L20 65 M20 65 L80 90",
    l: "M50 10 L50 90",
    m: "M12 40 L12 90 M12 58 C20 30 45 30 50 58 L50 90 M50 58 C60 30 85 30 90 58 L90 90",
    n: "M15 40 L15 90 M15 58 C25 30 70 30 80 58 L80 90",
    o: "M50 30 C25 30 12 45 12 62 C12 80 28 92 50 92 C72 92 88 80 88 62 C88 45 75 30 50 30",
    p: "M15 40 L15 110 M15 58 C25 30 70 30 80 58 C90 82 65 95 40 88 C25 84 15 72 15 58",
    q: "M80 40 L80 110 M80 58 C70 30 35 30 20 50 C5 75 30 95 60 88 C72 84 80 72 80 58",
    r: "M18 40 L18 90 M18 58 C28 35 55 35 65 45",
    s: "M78 42 C50 25 18 40 28 55 C38 67 75 60 75 78 C75 96 40 98 18 82",
    t: "M45 15 L45 78 C45 92 58 95 70 88 M20 42 L68 42",
    u: "M15 40 L15 70 C15 100 75 100 80 70 L80 40",
    v: "M12 40 L48 90 L85 40",
    w: "M8 40 L28 90 M28 90 L50 55 M50 55 L72 90 M72 90 L92 40",
    x: "M18 40 L80 90 M80 40 L18 90",
    y: "M12 40 L45 88 M80 40 L45 88 M45 88 L30 110",
    z: "M18 42 L80 42 M80 42 L18 90 M18 90 L80 90",
};

export const renderSingleStrokeWord = (
    text,
    {
        startX = 120,
        topY = 0,
        letterHeight = 100,
        letterWidth = 70,
        spacing = 18,
        strokeWidth = 3,
        stroke = "#94A3B8",
        opacity = 0.55,
        strokeDasharray = "2 7",
    } = {}
) => {

    const scaleY =
        letterHeight / 100;

    const scaleX =
        letterWidth / 100;

    let cursorX = startX;

    return String(text || "")
        .split("")
        .map((character, index) => {

            if (character === " ") {
                cursorX += letterWidth * 0.55;
                return null;
            }

            const path =
                singleStrokeGlyphs[character];

            if (!path) {
                cursorX += letterWidth + spacing;
                return null;
            }

            const currentX =
                cursorX;

            cursorX +=
                letterWidth +
                spacing;

            // Split pen-lift subpaths so every stroke has its own start dot and arrow.
            const strokePaths = path.match(/M[^M]*/g) || [path];
            const transform = `translate(${currentX} ${topY}) scale(${scaleX} ${scaleY})`;

            return (
                <g key={`${character}-${index}`} transform={transform}>
                    {strokePaths.map((strokePath, strokeIndex) => {
                        const firstPoint = strokePath.match(/^M\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/i);
                        const startPointX = firstPoint ? Number(firstPoint[1]) : 0;
                        const startPointY = firstPoint ? Number(firstPoint[2]) : 0;
                        return (
                            <g key={`${character}-${index}-stroke-${strokeIndex}`}>
                                <path
                                    d={strokePath.trim()}
                                    fill="none"
                                    markerEnd="url(#kinewrite-motion-arrow)"
                                    stroke={stroke}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={strokeDasharray}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    opacity={opacity}
                                />
                                <circle
                                    cx={startPointX}
                                    cy={startPointY}
                                    r={Math.max(2, strokeWidth * 1.4)}
                                    fill="#22c55e"
                                    opacity={Math.min(1, opacity + 0.25)}
                                />
                                {/* Offset each badge to a different side of its start point.
                                    This is especially important for letters such as A, where
                                    the first two strokes begin at the same apex. */}
                                <g
                                    transform={`translate(${startPointX + (strokeIndex % 2 === 0 ? -14 : 14) / Math.max(scaleX, 0.01)} ${startPointY + (strokeIndex > 1 ? 14 : -4) / Math.max(scaleY, 0.01)})`}
                                    pointerEvents="none"
                                >
                                    <circle
                                        r={8 / Math.max(scaleY, 0.01)}
                                        fill="white"
                                        stroke="#15803d"
                                        strokeWidth={1.5 / Math.max(scaleY, 0.01)}
                                        opacity="0.98"
                                    />
                                    <text
                                        x="0"
                                        y="0"
                                        fontSize={10 / Math.max(scaleY, 0.01)}
                                        fontWeight="800"
                                        fill="#15803d"
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                    >
                                        {strokeIndex + 1}
                                    </text>
                                </g>
                            </g>
                        );
                    })}
                </g>
            );
        });
};