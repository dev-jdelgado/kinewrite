// src/components/takehome/NameTracingWorksheet.jsx

import {
    renderSingleStrokeWord,
} from "../../utils/handwritingGuides";


const NameTracingWorksheet = ({
    studentName = "",
}) => {

    const name =
        String(studentName || "")
            .trim()
            .toUpperCase();


    if (!name) {
        return (
            <div className="text-center text-slate-500">
                Student name is unavailable.
            </div>
        );
    }


    const SVG_WIDTH = 1000;
    const SVG_HEIGHT = 120;

    const letterHeight = 80;
    const letterWidth = 50;
    const letterSpacing = 14;


    const naturalWidth =
        name
            .split("")
            .reduce(
                (total, character) => {

                    if (character === " ") {
                        return total +
                            letterWidth * 0.65;
                    }

                    return total +
                        letterWidth +
                        letterSpacing;

                },
                0
            );


    const maxWidth =
        SVG_WIDTH * 0.88;


    const scale =
        naturalWidth > maxWidth
            ? maxWidth / naturalWidth
            : 1;


    const finalLetterWidth =
        letterWidth * scale;

    const finalSpacing =
        letterSpacing * scale;


    const finalWidth =
        name
            .split("")
            .reduce(
                (total, character) => {

                    if (character === " ") {
                        return total +
                            finalLetterWidth * 0.65;
                    }

                    return total +
                        finalLetterWidth +
                        finalSpacing;

                },
                0
            );


    const startX =
        Math.max(
            30,
            (SVG_WIDTH - finalWidth) / 2
        );


    return (
        <div
            className="
                w-full
                max-w-[900px]
                mx-auto
                bg-white
                text-slate-800
                take-home-worksheet
            "
        >

            {/* ===================================== */}
            {/* PRINT CSS */}
            {/* ===================================== */}

            <style>{`
                @page {
                    size: A4 portrait;
                    margin: 12mm;
                }

                @media print {

                    html,
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }

                    /*
                     * Scale only the printed worksheet.
                     * The normal screen version is unchanged.
                     */
                    .take-home-worksheet {
                        width: 100% !important;
                        max-width: none !important;
                        margin: 0 auto !important;
                        padding: 0 !important;
                        box-sizing: border-box !important;
                        zoom: 1.15;
                    }


                    /* ============================== */
                    /* HEADER */
                    /* ============================== */

                    .take-home-worksheet > div:nth-of-type(2) {
                        padding-bottom: 10px !important;
                        margin-bottom: 14px !important;
                    }


                    .take-home-worksheet > div:nth-of-type(2) h1 {
                        font-size: 22px !important;
                        line-height: 1.15 !important;
                        margin-top: 4px !important;
                    }


                    .take-home-worksheet > div:nth-of-type(2) .text-2xl {
                        font-size: 18px !important;
                    }


                    .take-home-worksheet > div:nth-of-type(2) > div:last-child {
                        margin-top: 10px !important;
                    }


                    /* ============================== */
                    /* SECTION HEADINGS */
                    /* ============================== */

                    .take-home-worksheet h2 {
                        font-size: 18px !important;
                        line-height: 1.2 !important;
                    }


                    .take-home-worksheet h2 + p {
                        margin-top: 3px !important;
                        font-size: 11px !important;
                    }


                    /* ============================== */
                    /* TRACE SECTION */
                    /* ============================== */

                    .take-home-trace-section {
                        margin-top: 0 !important;
                    }


                    .take-home-trace-section > div {
                        margin-top: 8px !important;
                    }


                    .take-home-trace-section > div > div {
                        padding-bottom: 2px !important;
                    }


                    .take-home-trace-section svg {
                        height: 68px !important;
                    }


                    /* ============================== */
                    /* WRITE SECTION */
                    /* ============================== */

                    .take-home-write-section {
                        margin-top: 18px !important;
                    }


                    .take-home-write-section > div {
                        margin-top: 8px !important;
                        gap: 0 !important;
                    }


                    .take-home-write-section > div > div {
                        height: 38px !important;
                        margin-bottom: 7px !important;
                    }


                    /* ============================== */
                    /* FOOTER */
                    /* ============================== */

                    .take-home-worksheet > div:last-child {
                        margin-top: 12px !important;
                        padding-top: 7px !important;
                        font-size: 9px !important;
                    }


                    /* ============================== */
                    /* KEEP SECTIONS TOGETHER */
                    /* ============================== */

                    .take-home-trace-section,
                    .take-home-write-section {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                }
            `}</style>


            {/* ===================================== */}
            {/* HEADER */}
            {/* ===================================== */}

            <div
                className="
                    border-b-2
                    border-slate-200
                    pb-5
                    mb-8
                "
            >

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-6
                    "
                >

                    <div>

                        <div
                            className="
                                text-2xl
                                font-black
                                text-sky-600
                            "
                        >
                            KineWrite
                        </div>

                        <h1
                            className="
                                mt-2
                                text-3xl
                                font-black
                                text-slate-800
                            "
                        >
                            Take-Home Handwriting Practice
                        </h1>

                    </div>


                    <div
                        className="
                            text-right
                            text-sm
                            text-slate-500
                        "
                    >

                        <div>
                            Date:

                            <span
                                className="
                                    inline-block
                                    ml-2
                                    min-w-[130px]
                                    border-b
                                    border-slate-400
                                "
                            />

                        </div>

                    </div>

                </div>


                <div
                    className="
                        mt-6
                        flex
                        items-center
                        gap-3
                    "
                >

                    <span
                        className="
                            font-bold
                            text-slate-500
                        "
                    >
                        Student:
                    </span>


                    <span
                        className="
                            font-black
                            text-slate-800
                        "
                    >
                        {studentName}
                    </span>

                </div>

            </div>


            {/* ===================================== */}
            {/* TRACE YOUR NAME */}
            {/* ===================================== */}

            <section
                className="
                    take-home-trace-section
                "
            >

                <h2
                    className="
                        text-2xl
                        font-black
                        text-slate-800
                    "
                >
                    1. Trace Your Name
                </h2>


                <p
                    className="
                        mt-2
                        text-slate-500
                    "
                >
                    Carefully trace over the dotted letters.
                </p>


                <div
                    className="
                        mt-6
                        space-y-5
                    "
                >

                    {[1, 2, 3].map(row => (

                        <div
                            key={row}
                            className="
                                border-b-2
                                border-slate-200
                                pb-3
                            "
                        >

                            <svg
                                className="
                                    w-full
                                    h-[90px]
                                "
                                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                                preserveAspectRatio="xMidYMid meet"
                            >

                                {renderSingleStrokeWord(
                                    name,
                                    {
                                        startX,
                                        topY: 20,
                                        letterHeight,
                                        letterWidth: finalLetterWidth,
                                        spacing: finalSpacing,
                                        strokeWidth: 3,
                                        stroke: "#94A3B8",
                                        opacity: 0.55,
                                        strokeDasharray: "2 7",
                                    }
                                )}

                            </svg>

                        </div>

                    ))}

                </div>

            </section>


            {/* ===================================== */}
            {/* WRITE YOUR NAME */}
            {/* ===================================== */}

            <section
                className="
                    mt-12
                    take-home-write-section
                "
            >

                <h2
                    className="
                        text-2xl
                        font-black
                        text-slate-800
                    "
                >
                    2. Write Your Name
                </h2>


                <p
                    className="
                        mt-2
                        text-slate-500
                    "
                >
                    Now write your name independently.
                </p>


                <div
                    className="
                        mt-6
                        space-y-10
                    "
                >

                    {[1, 2, 3, 4].map(row => (

                        <div
                            key={row}
                            className="
                                h-12
                                border-b-2
                                border-blue-300
                            "
                        />

                    ))}

                </div>

            </section>


            {/* ===================================== */}
            {/* FOOTER */}
            {/* ===================================== */}

            <div
                className="
                    mt-12
                    pt-5
                    border-t
                    border-slate-200
                    text-center
                    text-sm
                    text-slate-400
                "
            >
                Keep practicing. Great handwriting takes practice!
            </div>

        </div>
    );
};


export default NameTracingWorksheet;