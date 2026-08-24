import Horizontal from "./guides/Horizontal";
import Vertical from "./guides/Vertical";
import Diagonal from "./guides/Diagonal";
import Zigzag from "./guides/Zigzag";
import Wave from "./guides/Wave";
import Circle from "./guides/Circle";
import Curves from "./guides/Curves";

const guides = {
    horizontal: Horizontal,
    vertical: Vertical,
    diagonal: Diagonal,
    zigzag: Zigzag,
    wave: Wave,
    circle: Circle,
    curves: Curves,
};

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
                    fontSize: "clamp(150px, 18vw, 280px)",
                    letterSpacing: "0.08em",
                    opacity: 0.75,
                }}
            >
                {text}
            </span>
        </div>
    );
};

const StrokeGuide = ({ type }) => {
    if (!type) {
        return null;
    }

    const guideType = String(type).trim();

    // --------------------------------------------------
    // EXISTING STROKE / SHAPE GUIDES
    // --------------------------------------------------

    const Guide = guides[guideType.toLowerCase()];

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
    // "C c"
    // --------------------------------------------------

    if (/^[A-Za-z](\s+[A-Za-z])?$/.test(guideType)) {
        return (
            <LetterGuide
                text={guideType}
            />
        );
    }

    // --------------------------------------------------
    // If the activity provides a letter pair such as
    // "A a" or another simple letter combination,
    // allow it as a guide.
    // --------------------------------------------------

    if (
        /^[A-Za-z](\s+[A-Za-z])+$/.test(guideType)
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