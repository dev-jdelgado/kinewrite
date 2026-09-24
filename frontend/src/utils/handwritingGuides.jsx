// src/utils/handwritingGuides.js

export const singleStrokeGlyphs = {
    A: "M0 100 L50 0 L100 100 M20 65 L80 65",
    B: "M0 0 L0 100 M0 0 C80 0 80 50 0 50 M0 50 C80 50 80 100 0 100",
    C: "M100 10 C20 -10 0 30 0 50 C0 70 20 110 100 90",
    D: "M0 0 L0 100 M0 0 C70 0 100 25 100 50 C100 75 70 100 0 100",
    E: "M100 0 L0 0 L0 100 L100 100 M0 50 L75 50",
    F: "M0 100 L0 0 L100 0 M0 50 L75 50",
    G: "M100 15 C20 -10 0 25 0 50 C0 80 25 105 100 90 L100 55 L55 55",
    H: "M0 0 L0 100 L0 50 L100 50 L100 0 L100 100",
    I: "M0 0 L100 0 M50 0 L50 100 M0 100 L100 100",
    J: "M100 0 L100 75 C100 110 0 110 0 75",
    K: "M0 0 L0 100 M100 0 L0 50 L100 100",
    L: "M0 0 L0 100 L100 100",
    M: "M0 100 L0 0 L50 60 L100 0 L100 100",
    N: "M0 100 L0 0 L100 100 L100 0",
    O: "M50 0 C15 0 0 20 0 50 C0 80 15 100 50 100 C85 100 100 80 100 50 C100 20 85 0 50 0",
    P: "M0 100 L0 0 C75 0 90 15 90 35 C90 55 75 65 0 65",
    Q: "M50 0 C15 0 0 20 0 50 C0 80 15 100 50 100 C85 100 100 80 100 50 C100 20 85 0 50 0 M65 70 L100 100",
    R: "M0 100 L0 0 C75 0 90 15 90 35 C90 55 75 65 0 65 M50 65 L100 100",
    S: "M90 10 C20 -10 0 25 50 50 C100 75 80 110 10 90",
    T: "M0 0 L100 0 M50 0 L50 100",
    U: "M0 0 L0 70 C0 110 100 110 100 70 L100 0",
    V: "M0 0 L50 100 L100 0",
    W: "M0 0 L25 100 L50 45 L75 100 L100 0",
    X: "M0 0 L100 100 M100 0 L0 100",
    Y: "M0 0 L50 50 L100 0 M50 50 L50 100",
    Z: "M0 0 L100 0 L0 100 L100 100",
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
        .toUpperCase()
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

            return (
                <path
                    key={`${character}-${index}`}
                    d={path}
                    transform={`
                        translate(${currentX} ${topY})
                        scale(${scaleX} ${scaleY})
                    `}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={opacity}
                />
            );
        });
};