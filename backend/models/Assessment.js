const db = require("../config/db");

const Assessment = {

    // ==========================================
    // Create Assessment
    // ==========================================
    async create(connection, assessmentData) {

        const {
            student_id,
            assessment_type,
            visual_motor_score,
            fine_motor_score,
            letter_formation_score,
            assessment_score,
            assessment_classification,
            recommended_level,
            assessment_remarks,
        } = assessmentData;

        const [result] = await connection.query(

            `
            INSERT INTO assessments
            (
                student_id,
                assessment_type,
                visual_motor_score,
                fine_motor_score,
                letter_formation_score,
                assessment_score,
                assessment_classification,
                recommended_level,
                assessment_remarks
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,

            [
                student_id,
                assessment_type,
                visual_motor_score,
                fine_motor_score,
                letter_formation_score,
                assessment_score,
                assessment_classification,
                recommended_level,
                assessment_remarks,
            ]
        );
        return result.insertId;
    },

    // ==========================================
    // Get Assessment By ID
    // ==========================================
    async findById(id) {

        const [rows] = await db.query(
            `
            SELECT *
            FROM assessments
            WHERE assessment_id = ?
            `,
            [id]
        );
        return rows[0] || null;
    },

    // ==========================================
    // Get Student Assessment History
    // ==========================================
    async findByStudent(studentId) {

        const [rows] = await db.query(
            `
            SELECT *
            FROM assessments
            WHERE student_id = ?
            ORDER BY assessment_date DESC
            `,
            [studentId]

        );
        return rows;
    },
};

module.exports = Assessment;