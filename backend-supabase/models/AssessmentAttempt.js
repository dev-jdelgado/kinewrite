const pool = require("../config/db");

class AssessmentAttempt {
    static async create({
        assessmentId,
        activityNo,
        activityCategory,
        activityName,
        activityType,
        promptText,
        promptType,
        completionTime = 0,
        penLifts = 0,
        strokeCount = 0,
        score = 0,
    }) {
        const result = await pool.query(
            `
            INSERT INTO assessment_attempts (
                assessment_id,
                activity_no,
                activity_category,
                activity_name,
                activity_type,
                prompt_text,
                prompt_type,
                completion_time,
                pen_lifts,
                stroke_count,
                score
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING attempt_id
            `,
            [
                assessmentId,
                activityNo,
                activityCategory,
                activityName,
                activityType,
                promptText,
                promptType,
                completionTime,
                penLifts,
                strokeCount,
                score,
            ]
        );

        return result.rows[0].attempt_id;
    }

    static async findById(attemptId) {
        const { rows } = await pool.query(
            `
            SELECT *
            FROM assessment_attempts
            WHERE attempt_id = $1
            `,
            [attemptId]
        );
        return rows[0] || null;
    }

    static async findByAssessment(assessmentId) {
        const { rows } = await pool.query(
            `
            SELECT *
            FROM assessment_attempts
            WHERE assessment_id = $1
            ORDER BY activity_no ASC
            `,
            [assessmentId]
        );
        return rows;
    }

    static async updateScore({ attemptId, score }) {
        await pool.query(
            `
            UPDATE assessment_attempts
            SET score = $1
            WHERE attempt_id = $2
            `,
            [score, attemptId]
        );
    }
}

module.exports = AssessmentAttempt;
