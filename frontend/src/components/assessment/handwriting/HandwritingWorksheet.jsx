import {
    forwardRef,
    useImperativeHandle,
    useRef,
} from "react";

import HandwritingCanvas from "./HandwritingCanvas";
import StrokeGuide from "./StrokeGuide";


const HandwritingWorksheet = forwardRef(
    (
        {
            activity,
        },
        ref
    ) => {

        const worksheetRef = useRef(null);

        const guideRef = useRef(null);

        const canvasRef = useRef(null);


        if (!activity) {

            return null;

        }


        const {
            activityType,
            promptText,
        } = activity;


        // ==========================================
        // Display Settings
        // ==========================================

        const getFontSize = () => {

            switch (activityType) {

                case "letter":

                    return "min(90cqh, 28cqw)";


                case "word":

                    return "min(72cqh, 23cqw)";


                default:

                    return "min(55cqh, 20cqw)";

            }

        };


        // ==========================================
        // Letter Spacing
        // ==========================================

        const getLetterSpacing = () => {

            switch (activityType) {

                case "letter":

                    return "0.08em";


                case "word":

                    return "0.20em";


                default:

                    return "0.15em";

            }

        };


        // ==========================================
        // Guide Opacity
        // ==========================================

        const guideOpacity =
            activityType === "stroke"
                ? 0.55
                : 0.70;


        // ==========================================
        // Calculate Actual Text Baseline
        // ==========================================

        const getTextBaseline = (
            guideElement,
            guideRect
        ) => {

            if (
                !guideElement ||
                !guideRect
            ) {

                return guideRect?.bottom ?? 0;

            }


            const computedStyle =
                window.getComputedStyle(
                    guideElement
                );


            const fontSize =
                parseFloat(
                    computedStyle.fontSize
                );


            const fontFamily =
                computedStyle.fontFamily;


            const fontWeight =
                computedStyle.fontWeight;


            const fontStyle =
                computedStyle.fontStyle;


            if (
                !fontSize ||
                !fontFamily
            ) {

                return guideRect.bottom;

            }


            const measurementCanvas =
                document.createElement(
                    "canvas"
                );


            const measurementContext =
                measurementCanvas.getContext(
                    "2d"
                );


            if (!measurementContext) {

                return guideRect.bottom;

            }


            measurementContext.font =
                `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;


            const metrics =
                measurementContext.measureText(
                    promptText || "Ag"
                );


            const fontAscent =
                Number.isFinite(
                    metrics.actualBoundingBoxAscent
                )
                    ? metrics.actualBoundingBoxAscent
                    : metrics.fontBoundingBoxAscent;


            const fontDescent =
                Number.isFinite(
                    metrics.actualBoundingBoxDescent
                )
                    ? metrics.actualBoundingBoxDescent
                    : metrics.fontBoundingBoxDescent;


            if (
                !Number.isFinite(fontAscent) ||
                !Number.isFinite(fontDescent)
            ) {

                return guideRect.bottom;

            }


            return (
                guideRect.top +
                fontAscent
            );

        };


        // ==========================================
        // Get Guide Metrics
        // ==========================================

        const getGuideMetrics = () => {

            const worksheetElement =
                worksheetRef.current;


            const guideElement =
                guideRef.current;


            // --------------------------------------
            // Stroke guides do not use DOM text
            // letter boxes.
            // --------------------------------------

            if (
                !worksheetElement
            ) {

                return null;

            }


            const worksheetRect =
                worksheetElement.getBoundingClientRect();


            const worksheetWidth =
                worksheetRect.width;


            const worksheetHeight =
                worksheetRect.height;


            // ======================================
            // STROKE GUIDE
            // ======================================

            if (
                activityType === "stroke"
            ) {

                return {

                    worksheet: {

                        width:
                            Number(
                                worksheetWidth.toFixed(2)
                            ),

                        height:
                            Number(
                                worksheetHeight.toFixed(2)
                            ),

                    },

                    guide: null,

                    letterBoxes: [],

                    normalized: {

                        top: 0,

                        bottom: 0,

                        baselineY: 0,

                        centerY: 0,

                    },

                };

            }


            // ======================================
            // TEXT GUIDE
            // ======================================

            if (
                !guideElement
            ) {

                return null;

            }


            const guideRect =
                guideElement.getBoundingClientRect();


            // --------------------------------------
            // Guide position relative to worksheet
            // --------------------------------------

            const guideLeft =
                guideRect.left -
                worksheetRect.left;


            const guideTop =
                guideRect.top -
                worksheetRect.top;


            const guideRight =
                guideRect.right -
                worksheetRect.left;


            const guideBottom =
                guideRect.bottom -
                worksheetRect.top;


            const guideWidth =
                guideRect.width;


            const guideHeight =
                guideRect.height;


            const guideCenterX =
                guideLeft +
                (
                    guideWidth / 2
                );


            const guideCenterY =
                guideTop +
                (
                    guideHeight / 2
                );


            // ======================================
            // ACTUAL TYPOGRAPHIC BASELINE
            // ======================================

            const absoluteGuideBaselineY =
                getTextBaseline(
                    guideElement,
                    guideRect
                );


            const guideBaselineY =
                absoluteGuideBaselineY -
                worksheetRect.top;


            // ======================================
            // PER-LETTER GUIDE BOXES
            // ======================================
            //
            // IMPORTANT:
            //
            // This is required by SpacingAnalyzer.
            //
            // Each character gets its actual DOM
            // bounding rectangle so the analyzer can
            // compare student letter positions against
            // the guide positions.
            //
            // This does NOT change the visual guide.
            //
            // ======================================

            const letterBoxes = [];


            if (
                guideElement.firstChild
            ) {

                const text =
                    String(
                        promptText || ""
                    );


                for (
                    let i = 0;
                    i < text.length;
                    i++
                ) {

                    const range =
                        document.createRange();


                    range.setStart(
                        guideElement.firstChild,
                        i
                    );


                    range.setEnd(
                        guideElement.firstChild,
                        i + 1
                    );


                    const charRect =
                        range.getBoundingClientRect();


                    if (
                        !charRect ||
                        charRect.width <= 0 ||
                        charRect.height <= 0
                    ) {

                        continue;

                    }


                    const relativeLeft =
                        charRect.left -
                        worksheetRect.left;


                    const relativeTop =
                        charRect.top -
                        worksheetRect.top;


                    const relativeRight =
                        charRect.right -
                        worksheetRect.left;


                    const relativeBottom =
                        charRect.bottom -
                        worksheetRect.top;


                    letterBoxes.push({

                        index:
                            i,

                        left:
                            Number(
                                relativeLeft.toFixed(2)
                            ),

                        right:
                            Number(
                                relativeRight.toFixed(2)
                            ),

                        top:
                            Number(
                                relativeTop.toFixed(2)
                            ),

                        bottom:
                            Number(
                                relativeBottom.toFixed(2)
                            ),

                        centerX:
                            Number(
                                (
                                    relativeLeft +
                                    (
                                        charRect.width /
                                        2
                                    )
                                ).toFixed(2)
                            ),

                        centerY:
                            Number(
                                (
                                    relativeTop +
                                    (
                                        charRect.height /
                                        2
                                    )
                                ).toFixed(2)
                            ),

                        width:
                            Number(
                                charRect.width.toFixed(2)
                            ),

                        height:
                            Number(
                                charRect.height.toFixed(2)
                            ),

                    });

                }

            }


            // ======================================
            // NORMALIZED GUIDE VALUES
            // ======================================

            const normalizedGuideTop =
                worksheetHeight > 0
                    ? guideTop /
                      worksheetHeight
                    : 0;


            const normalizedGuideBottom =
                worksheetHeight > 0
                    ? guideBottom /
                      worksheetHeight
                    : 0;


            const normalizedGuideBaseline =
                worksheetHeight > 0
                    ? guideBaselineY /
                      worksheetHeight
                    : 0;


            const normalizedGuideCenterY =
                worksheetHeight > 0
                    ? guideCenterY /
                      worksheetHeight
                    : 0;


            // ======================================
            // RETURN GUIDE METRICS
            // ======================================

            return {

                worksheet: {

                    width:
                        Number(
                            worksheetWidth.toFixed(2)
                        ),

                    height:
                        Number(
                            worksheetHeight.toFixed(2)
                        ),

                },


                guide: {

                    left:
                        Number(
                            guideLeft.toFixed(2)
                        ),

                    top:
                        Number(
                            guideTop.toFixed(2)
                        ),

                    right:
                        Number(
                            guideRight.toFixed(2)
                        ),

                    bottom:
                        Number(
                            guideBottom.toFixed(2)
                        ),

                    width:
                        Number(
                            guideWidth.toFixed(2)
                        ),

                    height:
                        Number(
                            guideHeight.toFixed(2)
                        ),

                    centerX:
                        Number(
                            guideCenterX.toFixed(2)
                        ),

                    centerY:
                        Number(
                            guideCenterY.toFixed(2)
                        ),

                    baselineY:
                        Number(
                            guideBaselineY.toFixed(2)
                        ),

                },


                // ==================================
                // REQUIRED BY SPACING ANALYZER
                // ==================================

                letterBoxes,


                normalized: {

                    top:
                        Number(
                            normalizedGuideTop.toFixed(6)
                        ),

                    bottom:
                        Number(
                            normalizedGuideBottom.toFixed(6)
                        ),

                    baselineY:
                        Number(
                            normalizedGuideBaseline.toFixed(6)
                        ),

                    centerY:
                        Number(
                            normalizedGuideCenterY.toFixed(6)
                        ),

                },

            };

        };


        // ==========================================
        // Export Reference Image
        // ==========================================
        //
        // Creates a clean PNG containing ONLY
        // the reference guide.
        //
        // Student handwriting is NOT included.
        //
        // This becomes the reference image used
        // by ReferenceFitAnalyzer.
        //
        // ==========================================

        const exportReferenceImage = async () => {

            const worksheetElement =
                worksheetRef.current;


            if (!worksheetElement) {

                return null;

            }


            const rect =
                worksheetElement.getBoundingClientRect();


            const width =
                Math.max(
                    1,
                    Math.round(
                        rect.width
                    )
                );


            const height =
                Math.max(
                    1,
                    Math.round(
                        rect.height
                    )
                );


            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                width;


            canvas.height =
                height;


            const ctx =
                canvas.getContext(
                    "2d"
                );


            if (!ctx) {

                return null;

            }


            // ======================================
            // STROKE REFERENCE
            // ======================================

            if (
                activityType === "stroke"
            ) {

                const svg =
                    worksheetElement.querySelector(
                        "svg"
                    );


                if (!svg) {

                    return null;

                }


                const clone =
                    svg.cloneNode(
                        true
                    );


                clone.setAttribute(
                    "width",
                    width
                );


                clone.setAttribute(
                    "height",
                    height
                );


                const blob =
                    new Blob(
                        [
                            new XMLSerializer()
                                .serializeToString(
                                    clone
                                )
                        ],
                        {
                            type:
                                "image/svg+xml;charset=utf-8"
                        }
                    );


                const url =
                    URL.createObjectURL(
                        blob
                    );


                try {

                    const image =
                        new Image();


                    await new Promise(
                        (
                            resolve,
                            reject
                        ) => {

                            image.onload =
                                resolve;

                            image.onerror =
                                reject;

                            image.src =
                                url;

                        }
                    );


                    ctx.drawImage(
                        image,
                        0,
                        0,
                        width,
                        height
                    );


                } finally {

                    URL.revokeObjectURL(
                        url
                    );

                }


                return canvas.toDataURL(
                    "image/png"
                );

            }


            // ======================================
            // TEXT REFERENCE
            // ======================================

            const guide =
                guideRef.current;


            if (!guide) {

                return null;

            }


            const style =
                window.getComputedStyle(
                    guide
                );


            const fontSize =
                parseFloat(
                    style.fontSize
                ) || 80;


            const letterSpacing =
                parseFloat(
                    style.letterSpacing
                ) || 0;


            const text =
                promptText || "";


            ctx.font =
                `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`;


            ctx.fillStyle =
                style.color ||
                "#cbd5e1";


            ctx.globalAlpha =
                parseFloat(
                    style.opacity
                ) || 0.7;


            ctx.textBaseline =
                "alphabetic";


            // --------------------------------------
            // Calculate total text width
            // --------------------------------------

            const totalWidth =
                Array.from(
                    text
                ).reduce(
                    (
                        sum,
                        character
                    ) => {

                        return (
                            sum +
                            ctx.measureText(
                                character
                            ).width
                        );

                    },
                    0
                ) +
                Math.max(
                    0,
                    text.length - 1
                ) *
                letterSpacing;


            // --------------------------------------
            // Center text
            // --------------------------------------

            let x =
                (
                    width -
                    totalWidth
                ) /
                2;


            const baseline =
                getTextBaseline(
                    guide,
                    guide.getBoundingClientRect()
                ) -
                rect.top;


            // --------------------------------------
            // Draw each character
            // --------------------------------------

            for (
                const character of text
            ) {

                ctx.fillText(
                    character,
                    x,
                    baseline
                );


                x +=
                    ctx.measureText(
                        character
                    ).width +
                    letterSpacing;

            }
            

            ctx.globalAlpha =
                1;


            return canvas.toDataURL(
                "image/png"
            );

        };


        // ==========================================
        // Expose Worksheet Methods
        // ==========================================

        useImperativeHandle(
            ref,
            () => ({

                // ----------------------------------
                // Canvas Methods
                // ----------------------------------

                clear: () => {

                    canvasRef.current?.clear?.();

                },


                getStrokes: () => {

                    return (
                        canvasRef.current?.getStrokes?.() ||
                        []
                    );

                },


                hasWriting: () => {

                    return (
                        canvasRef.current?.hasWriting?.() ??
                        false
                    );

                },


                exportImage: () => {

                    return (
                        canvasRef.current?.exportImage?.()
                    );

                },


                // ----------------------------------
                // Reference Image
                // ----------------------------------

                exportReferenceImage: async () => {

                    return (
                        await exportReferenceImage()
                    );

                },


                // ----------------------------------
                // Guide Metrics
                // ----------------------------------

                getGuideMetrics: () => {

                    return getGuideMetrics();

                },

            }),

            [
                activityType,
                promptText,
            ]
        );


        // ==========================================
        // Render Guide
        // ==========================================

        const renderGuide = () => {

            if (
                activityType === "stroke"
            ) {

                return (

                    <StrokeGuide
                        type={promptText}
                    />

                );

            }


            return (

                <span
                    ref={guideRef}

                    className="
                        font-light
                        text-slate-300
                        whitespace-nowrap
                        select-none
                        leading-none
                    "

                    style={{

                        fontSize:
                            getFontSize(),

                        letterSpacing:
                            getLetterSpacing(),

                        opacity:
                            guideOpacity,

                    }}
                >

                    {promptText}

                </span>

            );

        };


        // ==========================================
        // Render Worksheet
        // ==========================================

        return (

            <div
                ref={worksheetRef}

                className="
                    relative
                    w-full
                    h-[600px]

                    rounded-[40px]

                    border-[5px]
                    border-sky-500

                    bg-white

                    shadow-2xl

                    overflow-hidden
                "

                style={{
                    containerType: "size",
                }}
            >

                {/* ====================================== */}
                {/* Guide Layer */}
                {/* ====================================== */}

                <div
                    className="
                        absolute
                        inset-0

                        flex
                        items-center
                        justify-center

                        pointer-events-none
                        select-none

                        z-0

                        overflow-hidden
                    "
                >

                    {renderGuide()}

                </div>


                {/* ====================================== */}
                {/* Writing Canvas */}
                {/* ====================================== */}

                <div
                    className="
                        absolute
                        inset-0

                        z-10
                    "
                >

                    <HandwritingCanvas
                        ref={canvasRef}
                    />

                </div>

            </div>

        );

    }
);


HandwritingWorksheet.displayName =
    "HandwritingWorksheet";


export default HandwritingWorksheet;