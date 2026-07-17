const pool = require("../config/db");

class AssessmentAttempt {

    // ==========================================
    // Create Activity Attempt
    // ==========================================

    static async create({

        assessmentId,

        activityNo,

        activityCategory,

        promptText,

        promptType,

        completionTime = 0,

        penLifts = 0,

        strokeCount = 0,

        score = 0,

    }) {

        const [result] = await pool.query(

            `
            INSERT INTO assessment_attempts (

                assessment_id,

                activity_no,

                activity_category,

                prompt_text,

                prompt_type,

                completion_time,

                pen_lifts,

                stroke_count,

                score

            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,

            [

                assessmentId,

                activityNo,

                activityCategory,

                promptText,

                promptType,

                completionTime,

                penLifts,

                strokeCount,

                score,

            ]

        );

        return result.insertId;

    }

    // ==========================================
    // Get Attempt
    // ==========================================

    static async findById(attemptId) {

        const [rows] = await pool.query(

            `
            SELECT *
            FROM assessment_attempts
            WHERE attempt_id = ?
            `,

            [

                attemptId

            ]

        );

        return rows[0];

    }

    // ==========================================
    // Assessment Attempts
    // ==========================================

    static async findByAssessment(

        assessmentId

    ) {

        const [rows] = await pool.query(

            `
            SELECT *

            FROM assessment_attempts

            WHERE assessment_id = ?

            ORDER BY activity_no ASC
            `,

            [

                assessmentId

            ]

        );

        return rows;

    }

    // ==========================================
    // Update Activity Score
    // ==========================================

    static async updateScore({

        attemptId,

        score,

    }) {

        await pool.query(

            `
            UPDATE assessment_attempts

            SET

                score = ?

            WHERE attempt_id = ?
            `,

            [

                score,

                attemptId,

            ]

        );

    }

}

module.exports = AssessmentAttempt;