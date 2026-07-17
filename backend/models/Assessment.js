const pool = require("../config/db");

class Assessment {

    // ==========================================
    // Create Assessment
    // ==========================================

    static async create({

        studentId,
        assessmentType,

    }) {

        const [result] = await pool.query(

            `
            INSERT INTO assessments (

                student_id,
                assessment_type

            )

            VALUES (?, ?)
            `,

            [

                studentId,
                assessmentType,

            ]

        );

        return result.insertId;

    }

    // ==========================================
    // Get Assessment
    // ==========================================

    static async findById(id) {

        const [rows] = await pool.query(

            `
            SELECT *
            FROM assessments
            WHERE assessment_id = ?
            `,

            [id]

        );

        return rows[0];

    }

    // ==========================================
    // Student Assessments
    // ==========================================

    static async findByStudent(studentId) {

        const [rows] = await pool.query(

            `
            SELECT *
            FROM assessments

            WHERE student_id = ?

            ORDER BY assessment_date DESC
            `,

            [

                studentId

            ]

        );

        return rows;

    }

    // ==========================================
    // Save Final Scores
    // ==========================================

    static async updateScores({

        assessmentId,

        spacingScore,

        alignmentScore,

        strokeScore,

        overallScore,

        classification,

        recommendedLevel,

        remarks,

    }) {

        await pool.query(

            `
            UPDATE assessments

            SET

                spacing_score = ?,

                alignment_score = ?,

                stroke_score = ?,

                overall_score = ?,

                assessment_classification = ?,

                recommended_level = ?,

                assessment_remarks = ?

            WHERE assessment_id = ?
            `,

            [

                spacingScore,

                alignmentScore,

                strokeScore,

                overallScore,

                classification,

                recommendedLevel,

                remarks,

                assessmentId,

            ]

        );

    }

}

module.exports = Assessment;