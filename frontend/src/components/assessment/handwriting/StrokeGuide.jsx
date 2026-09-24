import Horizontal from "./guides/Horizontal";
import Vertical from "./guides/Vertical";
import Diagonal from "./guides/Diagonal";
import Zigzag from "./guides/Zigzag";
import Wave from "./guides/Wave";
import Curves from "./guides/Curves";

import SvgGuide from "./SvgGuide";
import guideStroke from "./guideStroke";


const guides = {
    horizontal: Horizontal,
    vertical: Vertical,
    diagonal: Diagonal,
    zigzag: Zigzag,
    wave: Wave,
    curves: Curves,
};


// ======================================================
// SHAPE GUIDE
//
// All Trace the Shapes activities use the same visual
// design as the existing Circle guide:
//
// - 2 shapes across with a wide gap
// - Light gray dashed stroke
// - Same guideStroke styling
// - Same SVG guide area
// ======================================================

const ShapeGuide = ({ type }) => {

    const shape =
        String(type)
            .trim()
            .toLowerCase();


    // Two shapes per row with a wide gap between them.
    // This gives each tracing guide more room and prevents
    // the larger shapes from feeling compressed.
    const positions = [
        300,
        700,
    ];


    // --------------------------------------------------
    // CIRCLE
    // --------------------------------------------------

    if (shape === "circle") {

        return (

            <SvgGuide>

                {positions.map((cx) => (

                    <circle
                        key={cx}
                        cx={cx}
                        cy="300"
                        r="105"
                        {...guideStroke}
                    />

                ))}

            </SvgGuide>

        );

    }


    // --------------------------------------------------
    // SQUARE
    // --------------------------------------------------

    if (shape === "square") {

        return (

            <SvgGuide>

                {positions.map((cx) => (

                    <rect
                        key={cx}
                        x={cx - 105}
                        y="195"
                        width="210"
                        height="210"
                        {...guideStroke}
                    />

                ))}

            </SvgGuide>

        );

    }


    // --------------------------------------------------
    // TRIANGLE
    // --------------------------------------------------

    if (shape === "triangle") {

        return (

            <SvgGuide>

                {positions.map((cx) => (

                    <path
                        key={cx}
                        d={`
                            M ${cx} 175
                            L ${cx + 115} 400
                            L ${cx - 115} 400
                            Z
                        `}
                        {...guideStroke}
                    />

                ))}

            </SvgGuide>

        );

    }


    // --------------------------------------------------
    // RECTANGLE
    // --------------------------------------------------

    if (shape === "rectangle") {

        return (

            <SvgGuide>

                {positions.map((cx) => (

                    <rect
                        key={cx}
                        x={cx - 135}
                        y="220"
                        width="270"
                        height="160"
                        {...guideStroke}
                    />

                ))}

            </SvgGuide>

        );

    }


    // --------------------------------------------------
    // OVAL
    // --------------------------------------------------

    if (shape === "oval") {

        return (

            <SvgGuide>

                {positions.map((cx) => (

                    <ellipse
                        key={cx}
                        cx={cx}
                        cy="300"
                        rx="125"
                        ry="90"
                        {...guideStroke}
                    />

                ))}

            </SvgGuide>

        );

    }


    // --------------------------------------------------
    // STAR
    // --------------------------------------------------

    if (shape === "star") {

        return (

            <SvgGuide>

                {positions.map((cx) => (

                    <path
                        key={cx}
                        d={`
                            M ${cx} 170

                            L ${cx + 32} 260

                            L ${cx + 128} 260

                            L ${cx + 50} 315

                            L ${cx + 80} 410

                            L ${cx} 355

                            L ${cx - 80} 410

                            L ${cx - 50} 315

                            L ${cx - 128} 260

                            L ${cx - 32} 260

                            Z
                        `}
                        {...guideStroke}
                    />

                ))}

            </SvgGuide>

        );

    }


    // --------------------------------------------------
    // HEART
    // --------------------------------------------------

    if (shape === "heart") {

        return (

            <SvgGuide>

                {positions.map((cx) => (

                    <path
                        key={cx}
                        d={`
                            M ${cx} 405

                            C ${cx - 35} 370,
                              ${cx - 120} 315,
                              ${cx - 120} 245

                            C ${cx - 120} 190,
                              ${cx - 55} 165,
                              ${cx} 225

                            C ${cx + 55} 165,
                              ${cx + 120} 190,
                              ${cx + 120} 245

                            C ${cx + 120} 315,
                              ${cx + 35} 370,
                              ${cx} 405

                            Z
                        `}
                        {...guideStroke}
                    />

                ))}

            </SvgGuide>

        );

    }


    // --------------------------------------------------
    // DIAMOND
    // --------------------------------------------------

    if (shape === "diamond") {

        return (

            <SvgGuide>

                {positions.map((cx) => (

                    <path
                        key={cx}
                        d={`
                            M ${cx} 170

                            L ${cx + 115} 300

                            L ${cx} 430

                            L ${cx - 115} 300

                            Z
                        `}
                        {...guideStroke}
                    />

                ))}

            </SvgGuide>

        );

    }


    // --------------------------------------------------
    // SEMICIRCLE
    // --------------------------------------------------

    if (shape === "semicircle") {

        return (

            <SvgGuide>

                {positions.map((cx) => (

                    <path
                        key={cx}
                        d={`
                            M ${cx - 110} 330

                            A 110 110
                            0 0 1
                            ${cx + 110} 330
                        `}
                        {...guideStroke}
                    />

                ))}

            </SvgGuide>

        );

    }


    // --------------------------------------------------
    // SPIRAL
    // --------------------------------------------------

    if (shape === "spiral") {

        return (

            <SvgGuide>

                {positions.map((cx) => (

                    <path
                        key={cx}
                        d={`
                            M ${cx} 300

                            C ${cx} 260,
                              ${cx + 55} 260,
                              ${cx + 55} 300

                            C ${cx + 55} 355,
                              ${cx - 55} 370,
                              ${cx - 75} 300

                            C ${cx - 100} 215,
                              ${cx + 105} 190,
                              ${cx + 120} 300
                        `}
                        {...guideStroke}
                    />

                ))}

            </SvgGuide>

        );

    }


    return null;

};


// ======================================================
// LETTER GUIDE
// ======================================================

const LetterGuide = ({ text }) => {

    return (

        <div
            className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                pointer-events-none
                select-none
                z-10
            "
        >

            <span
                className="
                    font-light
                    text-slate-300
                    whitespace-pre
                    leading-none
                "
                style={{
                    fontSize:
                        "clamp(150px, 18vw, 280px)",

                    letterSpacing:
                        "0.08em",

                    opacity:
                        0.75,
                }}
            >

                {text}

            </span>

        </div>

    );

};


// ======================================================
// MAIN STROKE GUIDE
// ======================================================

const StrokeGuide = ({ type }) => {

    if (!type) {

        return null;

    }


    const guideType =
        String(type).trim();


    const normalizedType =
        guideType.toLowerCase();


    // --------------------------------------------------
    // TRACE SHAPES
    //
    // Handle shapes BEFORE the regular stroke guides.
    // This is important because Circle used to be routed
    // to the old Circle.jsx component.
    // --------------------------------------------------

    const shapeTypes = [
        "circle",
        "square",
        "triangle",
        "rectangle",
        "oval",
        "star",
        "heart",
        "diamond",
        "semicircle",
        "spiral",
    ];


    if (
        shapeTypes.includes(
            normalizedType
        )
    ) {

        return (

            <ShapeGuide
                type={guideType}
            />

        );

    }


    // --------------------------------------------------
    // EXISTING LINE / STROKE GUIDES
    // --------------------------------------------------

    const Guide =
        guides[normalizedType];


    if (Guide) {

        return <Guide />;

    }


    // --------------------------------------------------
    // LETTER GUIDES
    //
    // Examples:
    // "A"
    // "A a"
    // "B b"
    // --------------------------------------------------

    if (
        /^[A-Za-z](\s+[A-Za-z])?$/.test(
            guideType
        )
    ) {

        return (

            <LetterGuide
                text={guideType}
            />

        );

    }


    // --------------------------------------------------
    // LETTER COMBINATIONS
    // --------------------------------------------------

    if (
        /^[A-Za-z](\s+[A-Za-z])+$/.test(
            guideType
        )
    ) {

        return (

            <LetterGuide
                text={guideType}
            />

        );

    }


    return null;

};


export default StrokeGuide;