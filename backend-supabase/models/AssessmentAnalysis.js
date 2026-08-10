const pool = require("../config/db");

class AssessmentAnalysis {
    static async create({
        assessmentId,
        spacingScore,
        alignmentScore,
        strokeScore,
        overallScore,
        classification,
    }) {
        const result = await pool.query(
            `
            INSERT INTO assessment_analysis (
                assessment_id,
                spacing_score,
                alignment_score,
                stroke_score,
                overall_score,
                classification
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING analysis_id
            `,
            [
                assessmentId,
                spacingScore,
                alignmentScore,
                strokeScore,
                overallScore,
                classification,
            ]
        );

        return result.rows[0].analysis_id;
    }

    static async findByAssessment(assessmentId) {
        const { rows } = await pool.query(
            `
            SELECT *
            FROM assessment_analysis
            WHERE assessment_id = $1
            ORDER BY analysis_id DESC
            LIMIT 1
            `,
            [assessmentId]
        );
        return rows[0] || null;
    }

    static async update({
        assessmentId,
        spacingScore,
        alignmentScore,
        strokeScore,
        overallScore,
        classification,
    }) {
        await pool.query(
            `
            UPDATE assessment_analysis
            SET
                spacing_score = $1,
                alignment_score = $2,
                stroke_score = $3,
                overall_score = $4,
                classification = $5
            WHERE assessment_id = $6
            `,
            [
                spacingScore,
                alignmentScore,
                strokeScore,
                overallScore,
                classification,
                assessmentId,
            ]
        );
    }

    static async delete(assessmentId) {
        await pool.query(
            `
            DELETE FROM assessment_analysis
            WHERE assessment_id = $1
            `,
            [assessmentId]
        );
    }
}

module.exports = AssessmentAnalysis;
