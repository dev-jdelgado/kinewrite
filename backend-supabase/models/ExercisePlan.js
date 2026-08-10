const db = require("../config/db");

const ExercisePlan = {
    async create(connection, planData) {
        const result = await connection.query(
            `
            INSERT INTO exercise_plan
            (
                student_id,
                assessment_id,
                current_level,
                current_exercise_id,
                completed
            )
            VALUES ($1, $2, $3, NULL, FALSE)
            RETURNING plan_id
            `,
            [
                planData.student_id,
                planData.assessment_id,
                planData.current_level,
            ]
        );
        return result.rows[0].plan_id;
    },

    async findActiveByStudent(studentId) {
        const { rows } = await db.query(
            `
            SELECT *
            FROM exercise_plan
            WHERE student_id = $1
            ORDER BY plan_id DESC
            LIMIT 1
            `,
            [studentId]
        );
        return rows[0] || null;
    },

    async updateCurrentExercise(planId, exerciseId) {
        await db.query(
            `
            UPDATE exercise_plan
            SET current_exercise_id = $1
            WHERE plan_id = $2
            `,
            [exerciseId, planId]
        );
    },

    async complete(planId) {
        await db.query(
            `
            UPDATE exercise_plan
            SET completed = TRUE
            WHERE plan_id = $1
            `,
            [planId]
        );
    },
};

module.exports = ExercisePlan;
