const db = require("../config/db");

class ExerciseSession {

    // ==========================================
    // Create Exercise Session
    // ==========================================

    static async create({
        studentId,
    }) {

        const [result] = await db.query(
            `
            INSERT INTO exercise_sessions (
                student_id,
                total_score,
                total_stars,
                completed
            )
            VALUES (?, 0, 0, 0)
            `,
            [
                studentId,
            ]
        );

        return result.insertId;
    }


    // ==========================================
    // Get Session By ID
    // ==========================================

    static async findById(sessionId) {

        const [rows] = await db.query(
            `
            SELECT *
            FROM exercise_sessions
            WHERE session_id = ?
            `,
            [
                sessionId,
            ]
        );

        return rows[0] || null;
    }


    // ==========================================
    // Get Student Sessions
    // ==========================================

    static async findByStudent(studentId) {

        const [rows] = await db.query(
            `
            SELECT *
            FROM exercise_sessions
            WHERE student_id = ?
            ORDER BY session_date DESC
            `,
            [
                studentId,
            ]
        );

        return rows;
    }


    // ==========================================
    // Complete Session
    // ==========================================

    static async complete({
        sessionId,
        totalScore,
        totalStars,
    }) {

        await db.query(
            `
            UPDATE exercise_sessions
            SET
                total_score = ?,
                total_stars = ?,
                completed = 1
            WHERE session_id = ?
            `,
            [
                totalScore,
                totalStars,
                sessionId,
            ]
        );
    }


    // ==========================================
    // Update Session Score
    // ==========================================

    static async updateScore({
        sessionId,
        totalScore,
        totalStars,
    }) {

        await db.query(
            `
            UPDATE exercise_sessions
            SET
                total_score = ?,
                total_stars = ?
            WHERE session_id = ?
            `,
            [
                totalScore,
                totalStars,
                sessionId,
            ]
        );
    }

}


module.exports = ExerciseSession;