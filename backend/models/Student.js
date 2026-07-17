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
    // Update Student Classification
    // ==========================================
    async updateClassification(
        connection,
        studentId,
        classification
    ) {
        await connection.query(
            `
            UPDATE students
            SET
                student_classification = ?,
                student_assessment_status = 'Completed'
            WHERE student_id = ?
            `,
            [
                classification,
                studentId,
            ]
        );
    },

    // ==========================================
    // Update Student Current Level
    // ==========================================
    async updateCurrentLevel(
        connection,
        studentId,
        level
    ) {

        await connection.query(
            `
            UPDATE students
            SET student_current_level = ?
            WHERE student_id = ?
            `,
            [
                level,
                studentId,
            ]
        );
    },

    // ==========================================
    // Update Student Last Activity
    // ==========================================
    async updateLastActivity(
        connection,
        studentId
    ) {
        await connection.query(
            `
            UPDATE students
            SET
                student_last_activity = NOW()
            WHERE student_id = ?
            `,
            [
                studentId,
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
    async updateStudentCode(
        connection,
        studentId,
        studentCode
    ) {
        await connection.query(
            `
            UPDATE students
            SET student_code = ?
            WHERE student_id = ?
            `,
            [
                studentCode,
                studentId,
            ]
        );
    },

    // ==========================================
    // Initialize Student Progress
    // ==========================================
    async initializeProgress(connection, progressData) {
        const {
            studentId,
            currentLevel,
            classification,
        } = progressData;

        // Check if a progress record already exists
        const [existing] = await connection.query(
            `
            SELECT progress_id
            FROM student_progress
            WHERE student_id = ?
            `,
            [
                studentId,
            ]
        );

        // ==========================================
        // Create New Progress
        // ==========================================
        if (existing.length === 0) {
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
                VALUES (?, ?, 0, 0, 0, ?)
                `,
                [
                    studentId,
                    currentLevel,
                    classification,
                ]
            );
            return;
        }

        // ==========================================
        // Update Existing Progress
        // ==========================================

        await connection.query(

            `
            UPDATE student_progress
            SET
                current_level = ?,
                current_classification = ?,
                updated_at = NOW()
            WHERE student_id = ?
            `,

            [
                currentLevel,
                classification,
                studentId,
            ]
        );
    },

    // ==========================================
    // Complete Assessment
    // ==========================================

    async completeAssessment(
        connection,
        assessmentData
    ) {

        const {

            studentId,

            assessmentId,

            classification,

            level,

            accuracy,

        } = assessmentData;

        // --------------------------------------
        // Update Student
        // --------------------------------------

        await connection.query(

            `
            UPDATE students
            SET
                student_classification = ?,
                student_assessment_status = 'Completed',
                student_current_level = ?,
                student_last_activity = NOW()
            WHERE student_id = ?
            `,

            [

                classification,

                level,

                studentId,

            ]

        );

        // --------------------------------------
        // Update Progress
        // --------------------------------------

        await connection.query(

            `
            UPDATE student_progress
            SET

                last_assessment_id = ?,

                current_level = ?,

                current_classification = ?,

                average_accuracy = ?,

                last_session = NOW(),

                updated_at = NOW()

            WHERE student_id = ?
            `,

            [

                assessmentId,

                level,

                classification,

                accuracy,

                studentId,

            ]

        );

    }
};

module.exports = Student;