const pool = require("../config/db");

class ExerciseAttempt {

    // ==========================================
    // Create Exercise Attempt
    // ==========================================

    static async create({
        sessionId,
        exerciseId = null,
        accuracy = 0,
        completionTime = 0,
        stars = 0,
        attempts = 1,
        handwritingImage = null,
        strokeData = "{}",
        strokeCount = 0,
        penLifts = 0,
    }) {
        const result = await pool.query(
            `
            INSERT INTO exercise_attempts (
                session_id,
                exercise_id,
                accuracy,
                completion_time,
                stars,
                attempts,
                handwriting_image,
                stroke_data,
                stroke_count,
                pen_lifts
            )
            VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10
            )
            RETURNING *
            `,
            [
                sessionId,
                exerciseId,
                accuracy,
                completionTime,
                stars,
                attempts,
                handwritingImage,
                strokeData,
                strokeCount,
                penLifts,
            ]
        );

        return result.rows[0].attempt_id;
    }

    // ==========================================
    // Get Attempt By ID
    // ==========================================

    static async findById(attemptId) {
        const result = await pool.query(
            `
            SELECT *
            FROM exercise_attempts
            WHERE attempt_id = $1
            `,
            [attemptId]
        );

        return result.rows[0] || null;
    }

    // ==========================================
    // Get Attempts For Session
    // ==========================================

    static async findBySession(sessionId) {
        const result = await pool.query(
            `
            SELECT
                ea.*,
                ec.exercise_title,
                ec.exercise_category,
                ec.exercise_type,
                ec.exercise_level,
                ec.exercise_order
            FROM exercise_attempts ea
            LEFT JOIN exercise_catalog ec
                ON ea.exercise_id = ec.exercise_id
            WHERE ea.session_id = $1
            ORDER BY
                ec.exercise_order ASC NULLS LAST,
                ea.attempt_id ASC
            `,
            [sessionId]
        );

        return result.rows;
    }

    // ==========================================
    // Get Attempts For Student
    // ==========================================

    static async findByStudent(studentId) {
        const result = await pool.query(
            `
            SELECT
                ea.*,
                es.session_date,
                es.total_score,
                es.total_stars,
                ec.exercise_title,
                ec.exercise_category,
                ec.exercise_type,
                ec.exercise_level,
                ec.exercise_order
            FROM exercise_attempts ea
            INNER JOIN exercise_sessions es
                ON es.session_id = ea.session_id
            LEFT JOIN exercise_catalog ec
                ON ea.exercise_id = ec.exercise_id
            WHERE es.student_id = $1
            ORDER BY
                es.session_date DESC,
                ea.attempt_id ASC
            `,
            [studentId]
        );

        return result.rows;
    }
}

module.exports = ExerciseAttempt;
