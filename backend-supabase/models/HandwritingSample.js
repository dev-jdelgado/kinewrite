const pool = require("../config/db");

class HandwritingSample {
    static async create({
        attemptId,
        imagePath,
        strokeJson,
        guideJson,
    }) {
        const result = await pool.query(
            `
            INSERT INTO handwriting_samples (
                attempt_id,
                image_path,
                stroke_json,
                guide_json
            )
            VALUES ($1, $2, $3, $4)
            RETURNING sample_id
            `,
            [
                attemptId,
                imagePath,
                JSON.stringify(strokeJson ?? []),
                guideJson ? JSON.stringify(guideJson) : null,
            ]
        );

        return result.rows[0].sample_id;
    }

    static async findByAttempt(attemptId) {
        const { rows } = await pool.query(
            `
            SELECT *
            FROM handwriting_samples
            WHERE attempt_id = $1
            ORDER BY sample_id DESC
            LIMIT 1
            `,
            [attemptId]
        );

        if (!rows.length) return null;

        const row = rows[0];

        return {
            ...row,
            stroke_json: row.stroke_json
                ? (typeof row.stroke_json === "string"
                    ? JSON.parse(row.stroke_json)
                    : row.stroke_json)
                : [],
            guide_json: row.guide_json
                ? (typeof row.guide_json === "string"
                    ? JSON.parse(row.guide_json)
                    : row.guide_json)
                : null,

            // Backwards-compatible alias for existing Supabase code.
            guide: row.guide_json
                ? (typeof row.guide_json === "string"
                    ? JSON.parse(row.guide_json)
                    : row.guide_json)
                : null,
        };
    }

    static async delete(attemptId) {
        await pool.query(
            `
            DELETE FROM handwriting_samples
            WHERE attempt_id = $1
            `,
            [attemptId]
        );
    }
}

module.exports = HandwritingSample;
