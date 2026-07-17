const pool = require("../config/db");

class HandwritingSample {

    // ==========================================
    // Save Handwriting Sample
    // ==========================================

    static async create({

        attemptId,

        imagePath,

        strokeJson,

    }) {

        const [result] = await pool.query(

            `
            INSERT INTO handwriting_samples (

                attempt_id,

                image_path,

                stroke_json

            )

            VALUES (?, ?, ?)
            `,

            [

                attemptId,

                imagePath,

                JSON.stringify(strokeJson),

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

        return {

            ...rows[0],

            stroke_json: rows[0].stroke_json

                ? JSON.parse(rows[0].stroke_json)

                : [],

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

module.exports = HandwritingSample;