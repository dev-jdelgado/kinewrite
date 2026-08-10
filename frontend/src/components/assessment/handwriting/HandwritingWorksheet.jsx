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
        //
        // The bottom of the DOM text element is NOT
        // necessarily the typographic baseline.
        //
        // We measure the same font used by the guide
        // and determine where the baseline sits inside
        // the rendered line box.
        //
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

            const fontStretch =
                computedStyle.fontStretch;

            if (
                !fontSize ||
                !fontFamily
            ) {

                return guideRect.bottom;

            }

            // --------------------------------------
            // Create measurement canvas
            // --------------------------------------

            const measurementCanvas =
                document.createElement("canvas");

            const measurementContext =
                measurementCanvas.getContext("2d");

            if (!measurementContext) {

                return guideRect.bottom;

            }

            // --------------------------------------
            // Match the worksheet guide font
            // --------------------------------------

            measurementContext.font =
                `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

            const metrics =
                measurementContext.measureText(
                    promptText || "Ag"
                );

            // --------------------------------------
            // Prefer font bounding box metrics
            //
            // These represent the font's actual
            // typographic ascent/descent rather
            // than just the visible ink.
            // --------------------------------------

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

            const baselineY =
                guideRect.top +
                fontAscent;

            return baselineY;

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
                // Guide Metrics
                // ----------------------------------

                getGuideMetrics: () => {

                    const worksheetElement =
                        worksheetRef.current;

                    const guideElement =
                        guideRef.current;

                    if (
                        !worksheetElement ||
                        !guideElement
                    ) {

                        return null;

                    }

                    const worksheetRect =
                        worksheetElement.getBoundingClientRect();

                    const guideRect =
                        guideElement.getBoundingClientRect();

                    const worksheetWidth =
                        worksheetRect.width;

                    const worksheetHeight =
                        worksheetRect.height;

                    // ----------------------------------
                    // Guide position relative to
                    // worksheet
                    // ----------------------------------

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
                        (guideWidth / 2);

                    const guideCenterY =
                        guideTop +
                        (guideHeight / 2);

                    // ----------------------------------
                    // ACTUAL TYPOGRAPHIC BASELINE
                    // ----------------------------------
                    //
                    // Do NOT use guideBottom.
                    //
                    // guideBottom represents the bottom
                    // of the DOM text box, not the actual
                    // baseline on which the student should
                    // write.
                    //
                    // ----------------------------------

                    const absoluteGuideBaselineY =
                        getTextBaseline(
                            guideElement,
                            guideRect
                        );

                    const guideBaselineY =
                        absoluteGuideBaselineY -
                        worksheetRect.top;

                    // ----------------------------------
                    // Normalized values
                    // ----------------------------------

                    const normalizedGuideTop =
                        worksheetHeight > 0
                            ? guideTop / worksheetHeight
                            : 0;

                    const normalizedGuideBottom =
                        worksheetHeight > 0
                            ? guideBottom / worksheetHeight
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

                },

            }),
            [
                promptText,
            ]
        );

        // ==========================================
        // Render Guide
        // ==========================================

        const renderGuide = () => {

            // --------------------------------------
            // Stroke Guides
            // --------------------------------------

            if (
                activityType === "stroke"
            ) {

                return (

                    <StrokeGuide
                        type={promptText}
                    />

                );

            }

            // --------------------------------------
            // Letter / Word Guides
            // --------------------------------------

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