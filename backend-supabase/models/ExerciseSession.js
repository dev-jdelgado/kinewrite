const pool = require("../config/db");

class ExerciseSession {

    // ==========================================
    // Create Exercise Session
    // ==========================================

    static async create({
        studentId,
        totalScore = 0,
        totalStars = 0,
        completed = false,
    }) {
        const result = await pool.query(
            `
            INSERT INTO exercise_sessions (
                student_id,
                total_score,
                total_stars,
                completed
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                studentId,
                totalScore,
                totalStars,
                completed,
            ]
        );

        return result.rows[0];
    }

    // ==========================================
    // Get Session By ID
    // ==========================================

    static async findById(sessionId) {
        const result = await pool.query(
            `
            SELECT *
            FROM exercise_sessions
            WHERE session_id = $1
            `,
            [sessionId]
        );

        return result.rows[0] || null;
    }

    // ==========================================
    // Find Unfinished Session
    // ==========================================

    static async findUnfinishedByStudent(studentId) {
        const result = await pool.query(
            `
            SELECT *
            FROM exercise_sessions
            WHERE student_id = $1
              AND completed = FALSE
            ORDER BY session_id DESC
            LIMIT 1
            `,
            [studentId]
        );

        return result.rows[0] || null;
    }

    // ==========================================
    // Get Student Sessions
    // ==========================================

    static async findByStudent(studentId) {
        const result = await pool.query(
            `
            SELECT *
            FROM exercise_sessions
            WHERE student_id = $1
            ORDER BY session_date DESC, session_id DESC
            `,
            [studentId]
        );

        return result.rows;
    }

    // ==========================================
    // Update Session Score
    // ==========================================

    static async updateScore({
        sessionId,
        totalScore,
        totalStars,
    }) {
        const result = await pool.query(
            `
            UPDATE exercise_sessions
            SET
                total_score = $1,
                total_stars = $2
            WHERE session_id = $3
            RETURNING *
            `,
            [
                totalScore,
                totalStars,
                sessionId,
            ]
        );

        return result.rows[0] || null;
    }

    // ==========================================
    // Complete Session
    // ==========================================

    static async complete({
        sessionId,
        totalScore,
        totalStars,
    }) {
        const result = await pool.query(
            `
            UPDATE exercise_sessions
            SET
                total_score = $1,
                total_stars = $2,
                completed = TRUE
            WHERE session_id = $3
            RETURNING *
            `,
            [
                totalScore,
                totalStars,
                sessionId,
            ]
        );

        return result.rows[0] || null;
    }
}

module.exports = ExerciseSession;
