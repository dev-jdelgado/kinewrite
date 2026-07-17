const pool = require("../config/db");

class AssessmentAnalysis {

    // ==========================================
    // Create Analysis
    // ==========================================

    static async create({

        assessmentId,

        spacingScore,

        alignmentScore,

        strokeScore,

        overallScore,

        classification,

    }) {

        const [result] = await pool.query(

            `
            INSERT INTO assessment_analysis (

                assessment_id,

                spacing_score,

                alignment_score,

                stroke_score,

                overall_score,

                classification

            )

            VALUES (?, ?, ?, ?, ?, ?)
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

        return result.insertId;

    }

    // ==========================================
    // Get Analysis
    // ==========================================

    static async findByAssessment(

        assessmentId

    ) {

        const [rows] = await pool.query(

            `
            SELECT *

            FROM assessment_analysis

            WHERE assessment_id = ?
            `,

            [

                assessmentId

            ]

        );

        return rows[0] || null;

    }

    // ==========================================
    // Update Analysis
    // ==========================================

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

                spacing_score = ?,

                alignment_score = ?,

                stroke_score = ?,

                overall_score = ?,

                classification = ?

            WHERE assessment_id = ?
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

    // ==========================================
    // Delete Analysis
    // ==========================================

    static async delete(

        assessmentId

    ) {

        await pool.query(

            `
            DELETE FROM assessment_analysis

            WHERE assessment_id = ?
            `,

            [

                assessmentId

            ]

        );

    }

}

module.exports = AssessmentAnalysis;