const db = require("../config/db");

const Student = {
    // ==========================================
    // Get All Active Students
    // ==========================================
    async findAll(schoolId) {
        const { rows } = await db.query(
            `
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
        WHERE student_is_active = TRUE
        AND school_id = $1
        ORDER BY student_fname ASC
        `,
            [schoolId]
        );

        return rows;
    },

    // ==========================================
    // Get Student By ID
    // ==========================================
    async findById(id, schoolId) {
        const { rows } = await db.query(
            `
        SELECT *
        FROM students
        WHERE student_id = $1
        AND school_id = $2
        AND student_is_active = TRUE
        `,
            [id, schoolId]
        );

        return rows[0] || null;
    },

    // ==========================================
    // Create Student
    // ==========================================
    async create(connection, studentData) {
        const result = await connection.query(
            `
        INSERT INTO students
        (
            school_id,
            student_fname,
            student_lname,
            student_gender,
            student_bday,
            student_grade_level,
            student_notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING student_id
        `,
            [
                studentData.school_id,
                studentData.student_fname,
                studentData.student_lname,
                studentData.student_gender,
                studentData.student_bday,
                studentData.student_grade_level,
                studentData.student_notes || "None",
            ]
        );

        return result.rows[0].student_id;
    },

    // ==========================================
    // Update Student
    // ==========================================
    async update(id, schoolId, studentData) {
        await db.query(
            `
        UPDATE students
        SET
            student_fname = $1,
            student_lname = $2,
            student_gender = $3,
            student_bday = $4,
            student_grade_level = $5,
            student_notes = $6
        WHERE student_id = $7
        AND school_id = $8
        `,
            [
                studentData.student_fname,
                studentData.student_lname,
                studentData.student_gender,
                studentData.student_bday,
                studentData.student_grade_level,
                studentData.student_notes || "None",
                id,
                schoolId,
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
                student_classification = $1,
                student_assessment_status = 'Completed'
            WHERE student_id = $2
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
            SET student_current_level = $1
            WHERE student_id = $2
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
                student_last_activity = CURRENT_TIMESTAMP
            WHERE student_id = $1
            `,
            [
                studentId,
            ]
        );
    },

    // ==========================================
    // Soft Delete Student
    // ==========================================
    async archive(id, schoolId) {
        await db.query(
            `
        UPDATE students
        SET student_is_active = FALSE
        WHERE student_id = $1
        AND school_id = $2
        `,
            [id, schoolId]
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
            SET student_code = $1
            WHERE student_id = $2
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
        // Supports both the object form and the studentId-only call.
        const data =
            typeof progressData === "object" && progressData !== null
                ? progressData
                : { studentId: progressData };

        const {
            studentId,
            currentLevel = 1,
            classification = "Not Assessed",
        } = data;

        const { rows: existing } = await connection.query(
            `
            SELECT progress_id
            FROM student_progress
            WHERE student_id = $1
            `,
            [studentId]
        );

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
                VALUES ($1, $2, 0, 0, 0, $3)
                `,
                [studentId, currentLevel, classification]
            );
            return;
        }

        await connection.query(
            `
            UPDATE student_progress
            SET
                current_level = $1,
                current_classification = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE student_id = $3
            `,
            [currentLevel, classification, studentId]
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
                student_classification = $1,
                student_assessment_status = 'Completed',
                student_current_level = $2,
                student_last_activity = CURRENT_TIMESTAMP
            WHERE student_id = $3
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

                last_assessment_id = $1,

                current_level = $2,

                current_classification = $3,

                average_accuracy = $4,

                last_session = CURRENT_TIMESTAMP,

                updated_at = CURRENT_TIMESTAMP

            WHERE student_id = $5
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