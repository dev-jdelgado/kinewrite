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


            const absoluteGuideBaselineY =
                getTextBaseline(
                    guideElement,
                    guideRect
                );


            const guideBaselineY =
                absoluteGuideBaselineY -
                worksheetRect.top;


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

        const exportReferenceImage = () => {

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


            // --------------------------------------
            // Stroke guides are handled separately
            // later.
            // --------------------------------------

            if (
                activityType === "stroke"
            ) {

                return null;

            }


            const worksheetRect =
                worksheetElement.getBoundingClientRect();


            const guideRect =
                guideElement.getBoundingClientRect();


            const width =
                Math.max(
                    1,
                    Math.round(
                        worksheetRect.width
                    )
                );


            const height =
                Math.max(
                    1,
                    Math.round(
                        worksheetRect.height
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


            const context =
                canvas.getContext(
                    "2d"
                );


            if (!context) {

                return null;

            }


            // --------------------------------------
            // Transparent background
            // --------------------------------------

            context.clearRect(
                0,
                0,
                width,
                height
            );


            const computedStyle =
                window.getComputedStyle(
                    guideElement
                );


            const fontSize =
                parseFloat(
                    computedStyle.fontSize
                );


            const fontFamily =
                computedStyle.fontFamily ||
                "sans-serif";


            const fontWeight =
                computedStyle.fontWeight ||
                "300";


            const fontStyle =
                computedStyle.fontStyle ||
                "normal";


            const letterSpacingValue =
                computedStyle.letterSpacing;


            let letterSpacing = 0;


            if (
                letterSpacingValue &&
                letterSpacingValue !== "normal"
            ) {

                letterSpacing =
                    parseFloat(
                        letterSpacingValue
                    ) || 0;

            }


            // --------------------------------------
            // Match guide font
            // --------------------------------------

            context.font =
                `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;


            context.textBaseline =
                "alphabetic";


            context.fillStyle =
                "rgba(100, 116, 139, 1)";


            // --------------------------------------
            // Determine guide position
            // --------------------------------------

            const guideX =
                guideRect.left -
                worksheetRect.left;


            const guideY =
                getTextBaseline(
                    guideElement,
                    guideRect
                ) -
                worksheetRect.top;


            const text =
                String(
                    promptText || ""
                );


            // --------------------------------------
            // Centered text with letter spacing
            // --------------------------------------

            if (
                text.length === 0
            ) {

                return null;

            }


            if (
                text.length === 1 ||
                letterSpacing === 0
            ) {

                context.fillText(
                    text,
                    guideX,
                    guideY
                );

            } else {

                const characterWidths =
                    [];


                let totalTextWidth = 0;


                for (
                    const character of text
                ) {

                    const characterWidth =
                        context.measureText(
                            character
                        ).width;


                    characterWidths.push(
                        characterWidth
                    );


                    totalTextWidth +=
                        characterWidth;

                }


                totalTextWidth +=
                    letterSpacing *
                    (
                        text.length - 1
                    );


                const actualCenterX =
                    (
                        guideX +
                        (
                            guideRect.width / 2
                        )
                    );


                let currentX =
                    actualCenterX -
                    (
                        totalTextWidth / 2
                    );


                text.split("").forEach(
                    (
                        character,
                        index
                    ) => {

                        context.fillText(
                            character,
                            currentX,
                            guideY
                        );


                        currentX +=
                            characterWidths[index] +
                            letterSpacing;

                    }
                );

            }


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
                // NEW
                // Reference Image
                // ----------------------------------

                exportReferenceImage: async () => {

                    const worksheet = worksheetRef.current;
                
                    if (!worksheet) return null;
                
                    const rect =
                        worksheet.getBoundingClientRect();
                
                    const width =
                        Math.max(
                            1,
                            Math.round(rect.width)
                        );
                
                    const height =
                        Math.max(
                            1,
                            Math.round(rect.height)
                        );
                
                    const canvas =
                        document.createElement("canvas");
                
                    canvas.width = width;
                    canvas.height = height;
                
                    const ctx =
                        canvas.getContext("2d");
                
                    if (!ctx) return null;
                
                    if (activityType === "stroke") {
                
                        const svg =
                            worksheet.querySelector("svg");
                
                        if (!svg) return null;
                
                        const clone =
                            svg.cloneNode(true);
                
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
                                        .serializeToString(clone)
                                ],
                                {
                                    type:
                                        "image/svg+xml;charset=utf-8"
                                }
                            );
                
                        const url =
                            URL.createObjectURL(blob);
                
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
                
                    // existing letter/word export...
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