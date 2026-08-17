const pool = require("../config/db");

class HandwritingSample {

    // ==========================================
    // Save Handwriting Sample
    // ==========================================

    static async create({

        attemptId,

        imagePath,

        strokeJson,

        guideJson,

    }) {

        const [result] = await pool.query(

            `
            INSERT INTO handwriting_samples (

                attempt_id,

                image_path,

                stroke_json,

                guide_json

            )

            VALUES (?, ?, ?, ?)
            `,

            [

                attemptId,

                imagePath,

                JSON.stringify(strokeJson || []),

                JSON.stringify(guideJson || {}),

            ]

        );

        return result.insertId;

    }


    // ==========================================
    // Get Sample by Attempt
    // ==========================================

    static async findByAttempt(

        attemptId

    ) {

        const [rows] = await pool.query(

            `
            SELECT *

            FROM handwriting_samples

            WHERE attempt_id = ?
            `,

            [

                attemptId

            ]

        );

        if (!rows.length) {

            return null;

        }

        const row =
            rows[0];


        // ==========================================
        // Parse Stroke JSON
        // ==========================================

        let strokeJson = [];

        if (
            row.stroke_json
        ) {

            try {

                strokeJson =
                    typeof row.stroke_json === "string"
                        ? JSON.parse(
                            row.stroke_json
                        )
                        : row.stroke_json;

            } catch (error) {

                console.error(
                    "Failed to parse stroke_json:",
                    error
                );

                strokeJson = [];

            }

        }


        // ==========================================
        // Parse Guide JSON
        // ==========================================

        let guideJson = null;

        if (
            row.guide_json
        ) {

            try {

                guideJson =
                    typeof row.guide_json === "string"
                        ? JSON.parse(
                            row.guide_json
                        )
                        : row.guide_json;

            } catch (error) {

                console.error(
                    "Failed to parse guide_json:",
                    error
                );

                guideJson = null;

            }

        }


        return {

            ...row,

            stroke_json:
                strokeJson,

            guide_json:
                guideJson,

        };

    }


    // ==========================================
    // Delete Sample
    // ==========================================

    static async delete(

        attemptId

    ) {

        await pool.query(

            `
            DELETE FROM handwriting_samples

            WHERE attempt_id = ?
            `,

            [

                attemptId

            ]

        );

    }

}

module.exports =
    HandwritingSample;