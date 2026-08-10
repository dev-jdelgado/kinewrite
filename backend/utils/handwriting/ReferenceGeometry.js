// ==========================================================
// ReferenceGeometry.js
// ==========================================================
//
// Central reference geometry for KineWrite handwriting
// assessment activities.
//
// All geometry is normalized to worksheet dimensions.
//
// X:
// 0.0 = left
// 1.0 = right
//
// Y:
// 0.0 = top
// 1.0 = bottom
//
// IMPORTANT:
// Uppercase and lowercase letters do NOT use identical
// vertical geometry.
//
// Uppercase:
// - reaches cap-height
//
// Lowercase:
// - x-height for a, c, e
// - ascender height for b, d
//
// Both share the same writing baseline.
// ==========================================================


class ReferenceGeometry {

    // ======================================================
    // Shared Vertical Reference
    // ======================================================

    static CAP_TOP = 0.20;

    static X_HEIGHT_TOP = 0.40;

    static BASELINE = 0.796;


    // ======================================================
    // Alignment Reference
    // ======================================================

    static alignment = {

        // --------------------------------------------------
        // A a
        // --------------------------------------------------

        "A a": {

            category: "alignment",

            letters: ["A", "a"],

            left: {

                index: 0,

                centerX: 0.32,

                top: 0.20,

                bottom: 0.796,

                height:
                    0.796 - 0.20,

            },

            right: {

                index: 1,

                centerX: 0.68,

                top: 0.40,

                bottom: 0.796,

                height:
                    0.796 - 0.40,

            },

            baseline: 0.796,

        },


        // --------------------------------------------------
        // B b
        // --------------------------------------------------

        "B b": {

            category: "alignment",

            letters: ["B", "b"],

            left: {

                index: 0,

                centerX: 0.32,

                top: 0.20,

                bottom: 0.796,

                height:
                    0.796 - 0.20,

            },

            right: {

                index: 1,

                centerX: 0.68,

                top: 0.20,

                bottom: 0.796,

                height:
                    0.796 - 0.20,

            },

            baseline: 0.796,

        },


        // --------------------------------------------------
        // C c
        // --------------------------------------------------

        "C c": {

            category: "alignment",

            letters: ["C", "c"],

            left: {

                index: 0,

                centerX: 0.32,

                top: 0.20,

                bottom: 0.796,

                height:
                    0.796 - 0.20,

            },

            right: {

                index: 1,

                centerX: 0.68,

                top: 0.40,

                bottom: 0.796,

                height:
                    0.796 - 0.40,

            },

            baseline: 0.796,

        },


        // --------------------------------------------------
        // D d
        // --------------------------------------------------

        "D d": {

            category: "alignment",

            letters: ["D", "d"],

            left: {

                index: 0,

                centerX: 0.32,

                top: 0.20,

                bottom: 0.796,

                height:
                    0.796 - 0.20,

            },

            right: {

                index: 1,

                centerX: 0.68,

                top: 0.20,

                bottom: 0.796,

                height:
                    0.796 - 0.20,

            },

            baseline: 0.796,

        },


        // --------------------------------------------------
        // E e
        // --------------------------------------------------

        "E e": {

            category: "alignment",

            letters: ["E", "e"],

            left: {

                index: 0,

                centerX: 0.32,

                top: 0.20,

                bottom: 0.796,

                height:
                    0.796 - 0.20,

            },

            right: {

                index: 1,

                centerX: 0.68,

                top: 0.40,

                bottom: 0.796,

                height:
                    0.796 - 0.40,

            },

            baseline: 0.796,

        },

    };


    // ======================================================
    // Alignment Tolerances
    // ======================================================

    static alignmentTolerance = {

        // Baseline:
        // ~3% of worksheet height.

        baseline: 0.03,


        // Horizontal position:
        // ~5% of worksheet width.

        centerX: 0.05,


        // Vertical position:
        // ~5% of worksheet height.

        centerY: 0.05,


        // Letter height:
        // ~10% of worksheet height.

        height: 0.10,


        // Severe deviations.

        severeBaseline: 0.15,

        severeCenterX: 0.20,

        severeCenterY: 0.20,

        severeHeight: 0.30,

    };


    // ======================================================
    // Get Alignment Reference
    // ======================================================

    static getAlignmentReference(promptText) {

        if (
            typeof promptText !== "string"
        ) {

            return null;

        }


        const normalizedPrompt =

            promptText
                .trim()
                .replace(/\s+/g, " ");


        return (

            this.alignment[
                normalizedPrompt
            ] || null

        );

    }


    // ======================================================
    // Get Reference Letter
    // ======================================================

    static getReferenceLetter(

        promptText,

        index

    ) {

        const reference =

            this.getAlignmentReference(
                promptText
            );


        if (!reference) {

            return null;

        }


        if (index === 0) {

            return reference.left;

        }


        if (index === 1) {

            return reference.right;

        }


        return null;

    }


    // ======================================================
    // Normalized X → Pixel
    // ======================================================

    static normalizedXToPixel(

        normalizedX,

        worksheetWidth

    ) {

        if (

            typeof normalizedX !== "number" ||

            typeof worksheetWidth !== "number" ||

            worksheetWidth <= 0

        ) {

            return null;

        }


        return (

            normalizedX *
            worksheetWidth

        );

    }


    // ======================================================
    // Normalized Y → Pixel
    // ======================================================

    static normalizedYToPixel(

        normalizedY,

        worksheetHeight

    ) {

        if (

            typeof normalizedY !== "number" ||

            typeof worksheetHeight !== "number" ||

            worksheetHeight <= 0

        ) {

            return null;

        }


        return (

            normalizedY *
            worksheetHeight

        );

    }


    // ======================================================
    // Pixel Alignment Reference
    // ======================================================

    static getPixelAlignmentReference(

        promptText,

        worksheetWidth,

        worksheetHeight

    ) {

        const reference =

            this.getAlignmentReference(
                promptText
            );


        if (!reference) {

            return null;

        }


        const left = {

            centerX:

                this.normalizedXToPixel(

                    reference.left.centerX,

                    worksheetWidth

                ),

            centerY:

                this.normalizedYToPixel(

                    (
                        reference.left.top +
                        reference.left.bottom
                    ) / 2,

                    worksheetHeight

                ),

            top:

                this.normalizedYToPixel(

                    reference.left.top,

                    worksheetHeight

                ),

            bottom:

                this.normalizedYToPixel(

                    reference.left.bottom,

                    worksheetHeight

                ),

            height:

                reference.left.height *
                worksheetHeight,

        };


        const right = {

            centerX:

                this.normalizedXToPixel(

                    reference.right.centerX,

                    worksheetWidth

                ),

            centerY:

                this.normalizedYToPixel(

                    (
                        reference.right.top +
                        reference.right.bottom
                    ) / 2,

                    worksheetHeight

                ),

            top:

                this.normalizedYToPixel(

                    reference.right.top,

                    worksheetHeight

                ),

            bottom:

                this.normalizedYToPixel(

                    reference.right.bottom,

                    worksheetHeight

                ),

            height:

                reference.right.height *
                worksheetHeight,

        };


        return {

            category:
                reference.category,

            letters:
                reference.letters,

            baseline:

                this.normalizedYToPixel(

                    reference.baseline,

                    worksheetHeight

                ),

            left,

            right,

        };

    }


    // ======================================================
    // Get Alignment Tolerance
    // ======================================================

    static getAlignmentTolerance(

        worksheetWidth,

        worksheetHeight

    ) {

        if (

            typeof worksheetWidth !== "number" ||

            typeof worksheetHeight !== "number"

        ) {

            return {

                baseline: 18,

                centerX: 40,

                centerY: 30,

                height: 40,

                severeBaseline: 90,

                severeCenterX: 150,

                severeCenterY: 120,

                severeHeight: 180,

            };

        }


        return {

            baseline:

                this.alignmentTolerance.baseline *
                worksheetHeight,

            centerX:

                this.alignmentTolerance.centerX *
                worksheetWidth,

            centerY:

                this.alignmentTolerance.centerY *
                worksheetHeight,

            height:

                this.alignmentTolerance.height *
                worksheetHeight,

            severeBaseline:

                this.alignmentTolerance.severeBaseline *
                worksheetHeight,

            severeCenterX:

                this.alignmentTolerance.severeCenterX *
                worksheetWidth,

            severeCenterY:

                this.alignmentTolerance.severeCenterY *
                worksheetHeight,

            severeHeight:

                this.alignmentTolerance.severeHeight *
                worksheetHeight,

        };

    }


    // ======================================================
    // Check Whether Prompt Is Supported
    // ======================================================

    static hasAlignmentReference(promptText) {

        return (

            this.getAlignmentReference(
                promptText
            ) !== null

        );

    }


    // ======================================================
    // Get Supported Alignment Activities
    // ======================================================

    static getSupportedAlignmentActivities() {

        return Object.keys(
            this.alignment
        );

    }

}


// ==========================================================
// Export
// ==========================================================

module.exports =
    ReferenceGeometry;