const db = require("../config/db");

const ExercisePlan = {

    // ==========================================
    // Create Exercise Plan
    // ==========================================
    async create(connection, planData) {

        const [result] = await connection.query(
            `
            INSERT INTO exercise_plan
            (
                student_id,
                assessment_id,
                current_level,
                current_exercise_id,
                completed
            )
            VALUES (?, ?, ?, NULL, 0)
            `,
            [
                planData.student_id,
                planData.assessment_id,
                planData.current_level,
            ]
        );
        return result.insertId;
    },

    // ==========================================
    // Get Active Plan
    // ==========================================
    async findActiveByStudent(studentId) {

        const [rows] = await db.query(

            `
            SELECT *
            FROM exercise_plan
            WHERE student_id = ?
            ORDER BY plan_id DESC
            LIMIT 1
            `,
            [
                studentId,
            ]
        );
        return rows[0] || null;
    },

    // ==========================================
    // Update Current Exercise
    // ==========================================
    async updateCurrentExercise(
        planId,
        exerciseId
    ) {

        await db.query(
            `
            UPDATE exercise_plan
            SET current_exercise_id = ?
            WHERE plan_id = ?
            `,
            [
                exerciseId,
                planId,
            ]
        );
    },

    // ==========================================
    // Complete Plan
    // ==========================================
    async complete(planId) {

        await db.query(
            `
            UPDATE exercise_plan
            SET
                completed = 1

            WHERE
                plan_id = ?
            `,

            [
                planId,
            ]
        );
    },
};

module.exports = ExercisePlan;