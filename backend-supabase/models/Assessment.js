const pool = require("../config/db");

class Assessment {
    static async create({ studentId, assessmentType }) {
        const result = await pool.query(
            `
            INSERT INTO assessments (
                student_id,
                assessment_type
            )
            VALUES ($1, $2)
            RETURNING assessment_id
            `,
            [studentId, assessmentType]
        );

        return result.rows[0].assessment_id;
    }

    static async findById(id) {
        const { rows } = await pool.query(
            `
            SELECT *
            FROM assessments
            WHERE assessment_id = $1
            `,
            [id]
        );
        return rows[0] || null;
    }

    static async findByStudent(studentId) {
        const { rows } = await pool.query(
            `
            SELECT *
            FROM assessments
            WHERE student_id = $1
            ORDER BY assessment_date DESC
            `,
            [studentId]
        );
        return rows;
    }

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
                spacing_score = $1,
                alignment_score = $2,
                stroke_score = $3,
                overall_score = $4,
                assessment_classification = $5,
                recommended_level = $6,
                assessment_remarks = $7
            WHERE assessment_id = $8
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
