const db = require("../config/db");

const Student = {
    // ==========================================
    // Get All Active Students
    // ==========================================
    async findAll() {
        const [rows] = await db.query(`
            SELECT
                student_id,
                student_code,
                student_fname,
                student_lname,
                student_gender,
                student_grade_level,
                student_classification,
                student_assessment_status,
                student_current_level,
                student_last_activity
            FROM students
            WHERE student_is_active = 1
            ORDER BY student_fname ASC
        `);

        return rows;
    },

    // ==========================================
    // Get Student By ID
    // ==========================================
    async findById(id) {
        const [rows] = await db.query(
            `
            SELECT *
            FROM students
            WHERE student_id = ?
            AND student_is_active = 1
            `,
            [id]
        );

        return rows[0] || null;
    },

    // ==========================================
    // Create Student
    // ==========================================
    async create(connection, studentData) {
        const [result] = await connection.query(
            `
            INSERT INTO students
            (
                student_fname,
                student_lname,
                student_gender,
                student_bday,
                student_grade_level,
                student_notes
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                studentData.student_fname,
                studentData.student_lname,
                studentData.student_gender,
                studentData.student_bday,
                studentData.student_grade_level,
                studentData.student_notes || null,
            ]
        );

        return result.insertId;
    },

    // ==========================================
    // Update Student
    // ==========================================
    async update(id, studentData) {
        await db.query(
            `
            UPDATE students
            SET
                student_fname = ?,
                student_lname = ?,
                student_gender = ?,
                student_bday = ?,
                student_grade_level = ?,
                student_notes = ?
            WHERE student_id = ?
            `,
            [
                studentData.student_fname,
                studentData.student_lname,
                studentData.student_gender,
                studentData.student_bday,
                studentData.student_grade_level,
                studentData.student_notes || null,
                id,
            ]
        );
    },

    // ==========================================
    // Soft Delete Student
    // ==========================================
    async archive(id) {
        await db.query(
            `
            UPDATE students
            SET student_is_active = 0
            WHERE student_id = ?
            `,
            [id]
        );
    },

    // ==========================================
    // Update Student Code
    // ==========================================
    async updateStudentCode(connection, studentId, studentCode) {
        await connection.query(
            `
            UPDATE students
            SET student_code = ?
            WHERE student_id = ?
            `,
            [studentCode, studentId]
        );
    },

    // ==========================================
    // Initialize Student Progress
    // ==========================================
    async initializeProgress(connection, studentId) {
        await connection.query(
            `
            INSERT INTO student_progress
            (
                student_id,
                current_level,
                completed_exercises,
                average_accuracy,
                total_stars,
                current_classification
            )
            VALUES (?,1,0,0,0,'Not Assessed')
            `,
            [studentId]
        );
    },
};

module.exports = Student;