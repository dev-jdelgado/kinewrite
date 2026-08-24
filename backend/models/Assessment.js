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
            SELECT

                a.*,

                COALESCE(
                    aa.spacing_score,
                    a.spacing_score
                ) AS spacing_score,

                COALESCE(
                    aa.alignment_score,
                    a.alignment_score
                ) AS alignment_score,

                COALESCE(
                    aa.stroke_score,
                    a.stroke_score
                ) AS stroke_score,

                COALESCE(
                    aa.overall_score,
                    a.overall_score
                ) AS overall_score,

                COALESCE(
                    aa.classification,
                    a.assessment_classification
                ) AS assessment_classification,

                aa.analysis_id

            FROM assessments a

            LEFT JOIN assessment_analysis aa
                ON aa.assessment_id = a.assessment_id

            WHERE a.assessment_id = ?

            LIMIT 1
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
            SELECT

                a.*,

                /*
                 * Use the analyzed result from
                 * assessment_analysis when available.
                 *
                 * Fall back to assessments when
                 * analysis does not exist.
                 */

                COALESCE(
                    aa.spacing_score,
                    a.spacing_score
                ) AS spacing_score,

                COALESCE(
                    aa.alignment_score,
                    a.alignment_score
                ) AS alignment_score,

                COALESCE(
                    aa.stroke_score,
                    a.stroke_score
                ) AS stroke_score,

                COALESCE(
                    aa.overall_score,
                    a.overall_score
                ) AS overall_score,

                COALESCE(
                    aa.classification,
                    a.assessment_classification
                ) AS assessment_classification,

                aa.analysis_id

            FROM assessments a

            LEFT JOIN assessment_analysis aa
                ON aa.assessment_id = a.assessment_id

            WHERE a.student_id = ?

            ORDER BY a.assessment_date DESC

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