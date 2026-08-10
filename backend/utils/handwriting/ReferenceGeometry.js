// ==========================================================
// ReferenceGeometry.js
// ==========================================================
//
// Central reference geometry for KineWrite handwriting
// assessment activities.
//
// IMPORTANT:
// These values are normalized to the worksheet dimensions.
// They are NOT dependent on the student's writing.
//
// Normalized coordinate system:
//
// X: 0.0 = left side of worksheet
//    1.0 = right side of worksheet
//
// Y: 0.0 = top of worksheet
//    1.0 = bottom of worksheet
//
// This allows the geometry to work across different
// screen sizes and worksheet resolutions.
// ==========================================================


class ReferenceGeometry {

    // ======================================================
    // Alignment Reference
    // ======================================================
    //
    // Alignment activities:
    //
    // 1. A a
    // 2. B b
    // 3. C c
    // 4. D d
    // 5. E e
    //
    // The reference is intentionally based on normalized
    // worksheet coordinates.
    //
    // The actual worksheet guide establishes the main
    // baseline and writing area.
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

                centerY: 0.50,

                top: 0.20,

                bottom: 0.80,

                height: 0.60,

            },

            right: {

                index: 1,

                centerX: 0.68,

                centerY: 0.50,

                top: 0.20,

                bottom: 0.80,

                height: 0.60,

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

                centerY: 0.50,

                top: 0.20,

                bottom: 0.80,

                height: 0.60,

            },

            right: {

                index: 1,

                centerX: 0.68,

                centerY: 0.50,

                top: 0.20,

                bottom: 0.80,

                height: 0.60,

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

                centerY: 0.50,

                top: 0.20,

                bottom: 0.80,

                height: 0.60,

            },

            right: {

                index: 1,

                centerX: 0.68,

                centerY: 0.50,

                top: 0.20,

                bottom: 0.80,

                height: 0.60,

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

                centerY: 0.50,

                top: 0.20,

                bottom: 0.80,

                height: 0.60,

            },

            right: {

                index: 1,

                centerX: 0.68,

                centerY: 0.50,

                top: 0.20,

                bottom: 0.80,

                height: 0.60,

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

                centerY: 0.50,

                top: 0.20,

                bottom: 0.80,

                height: 0.60,

            },

            right: {

                index: 1,

                centerX: 0.68,

                centerY: 0.50,

                top: 0.20,

                bottom: 0.80,

                height: 0.60,

            },

            baseline: 0.796,

        },

    };


    // ======================================================
    // Alignment Tolerances
    // ======================================================
    //
    // These values determine how much deviation is allowed
    // before the student's writing starts losing points.
    //
    // They are normalized values.
    // ======================================================

    static alignmentTolerance = {

        // Baseline tolerance
        //
        // Approximately 3% of worksheet height.

        baseline: 0.03,


        // Center X tolerance
        //
        // Approximately 5% of worksheet width.

        centerX: 0.05,


        // Center Y tolerance
        //
        // Approximately 5% of worksheet height.

        centerY: 0.05,


        // Height tolerance
        //
        // Approximately 10% difference from reference height.

        height: 0.10,


        // Severe deviation thresholds.

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


        if (
            !reference
        ) {

            return null;

        }


        if (
            index === 0
        ) {

            return reference.left;

        }


        if (
            index === 1
        ) {

            return reference.right;

        }


        return null;

    }


    // ======================================================
    // Convert Normalized X to Worksheet Pixel
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
    // Convert Normalized Y to Worksheet Pixel
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
    // Get Pixel Reference
    // ======================================================
    //
    // Converts the normalized reference into the actual
    // worksheet coordinate system.
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


        if (
            !reference
        ) {

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

                    reference.left.centerY,

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

                    reference.right.centerY,

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
    // Get Tolerance
    // ======================================================

    static getAlignmentTolerance(

        worksheetWidth,

        worksheetHeight

    ) {

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

module.exports = ReferenceGeometry;