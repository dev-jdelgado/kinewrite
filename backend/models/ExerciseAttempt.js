const db = require("../config/db");

class ExerciseAttempt {

    // ==========================================
    // Create Exercise Attempt
    // ==========================================

    static async create({

        sessionId,
        exerciseId,

        accuracy = 0,
        completionTime = 0,

        stars = 0,
        attempts = 1,

        handwritingImage = null,
        strokeData = null,

        strokeCount = 0,
        penLifts = 0,

    }) {

        const [result] = await db.query(
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

            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

        return result.insertId;
    }


    // ==========================================
    // Get Attempt By ID
    // ==========================================

    static async findById(attemptId) {

        const [rows] = await db.query(
            `
            SELECT *
            FROM exercise_attempts
            WHERE attempt_id = ?
            `,
            [
                attemptId,
            ]
        );

        return rows[0] || null;
    }


    // ==========================================
    // Get Attempts For Session
    // ==========================================

    static async findBySession(sessionId) {

        const [rows] = await db.query(
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

            WHERE ea.session_id = ?

            ORDER BY
                ec.exercise_order ASC,
                ea.attempt_id ASC
            `,
            [
                sessionId,
            ]
        );

        return rows;
    }


    // ==========================================
    // Get Attempts For Student
    // ==========================================

    static async findByStudent(studentId) {

        const [rows] = await db.query(
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
                ON ea.session_id = es.session_id

            LEFT JOIN exercise_catalog ec
                ON ea.exercise_id = ec.exercise_id

            WHERE es.student_id = ?

            ORDER BY
                es.session_date DESC,
                ea.attempt_id ASC
            `,
            [
                studentId,
            ]
        );

        return rows;
    }

}


module.exports = ExerciseAttempt;