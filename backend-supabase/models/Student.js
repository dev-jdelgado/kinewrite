const db = require("../config/db");

const Student = {
    async findAll() {
        const { rows } = await db.query(`
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
            ORDER BY student_fname ASC
        `);
        return rows;
    },

    async findById(id) {
        const { rows } = await db.query(
            `
            SELECT *
            FROM students
            WHERE student_id = $1
            AND student_is_active = TRUE
            `,
            [id]
        );
        return rows[0] || null;
    },

    async create(connection, studentData) {
        const result = await connection.query(
            `
            INSERT INTO students
            (
                student_code,
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
                "PENDING",
                studentData.student_fname,
                studentData.student_lname,
                studentData.student_gender,
                studentData.student_bday,
                studentData.student_grade_level,
                studentData.student_notes || null,
            ]
        );
        return result.rows[0].student_id;
    },

    async update(id, studentData) {
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

    async updateClassification(connection, studentId, classification) {
        await connection.query(
            `
            UPDATE students
            SET
                student_classification = $1,
                student_assessment_status = 'Completed'
            WHERE student_id = $2
            `,
            [classification, studentId]
        );
    },

    async updateCurrentLevel(connection, studentId, level) {
        await connection.query(
            `
            UPDATE students
            SET student_current_level = $1
            WHERE student_id = $2
            `,
            [level, studentId]
        );
    },

    async updateLastActivity(connection, studentId) {
        await connection.query(
            `
            UPDATE students
            SET student_last_activity = CURRENT_TIMESTAMP
            WHERE student_id = $1
            `,
            [studentId]
        );
    },

    async archive(id) {
        await db.query(
            `
            UPDATE students
            SET student_is_active = FALSE
            WHERE student_id = $1
            `,
            [id]
        );
    },

    async updateStudentCode(connection, studentId, studentCode) {
        await connection.query(
            `
            UPDATE students
            SET student_code = $1
            WHERE student_id = $2
            `,
            [studentCode, studentId]
        );
    },

    async initializeProgress(connection, progressData) {
        // Supports both the current object form and the older studentId-only call.
        const data =
            typeof progressData === "object" && progressData !== null
                ? progressData
                : { studentId: progressData };

        const {
            studentId,
            currentLevel = 1,
            classification = "Not Assessed",
        } = data;

        const existing = await connection.query(
            `
            SELECT progress_id
            FROM student_progress
            WHERE student_id = $1
            `,
            [studentId]
        );

        if (existing.rows.length === 0) {
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

    async completeAssessment(connection, assessmentData) {
        const {
            studentId,
            assessmentId,
            classification,
            level,
            accuracy,
        } = assessmentData;

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
            [classification, level, studentId]
        );

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
            [assessmentId, level, classification, accuracy, studentId]
        );
    }
};

module.exports = Student;
