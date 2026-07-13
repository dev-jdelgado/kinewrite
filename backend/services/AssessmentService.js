const db = require("../config/db");

const Assessment = require("../models/Assessment");
const Student = require("../models/Student");
const ExercisePlan = require("../models/ExercisePlan");

class AssessmentService {

    // =====================================================
    // Complete Assessment Workflow
    // =====================================================

    static async completeAssessment(data) {

        const connection = await db.getConnection();

        try {

            // =============================================
            // Begin Transaction
            // =============================================
            await connection.beginTransaction();

            // =============================================
            // Save Assessment
            // =============================================
            const assessmentId = await Assessment.create(
                connection,
                {
                    student_id: data.student_id,

                    assessment_type: data.assessment_type,

                    visual_motor_score:
                        data.visual_motor_score,

                    fine_motor_score:
                        data.fine_motor_score,

                    letter_formation_score:
                        data.letter_formation_score,

                    assessment_score:
                        data.assessment_score,

                    assessment_classification:
                        data.assessment_classification,

                    recommended_level:
                        data.recommended_level,

                    assessment_remarks:
                        data.assessment_remarks,
                }
            );

            // =============================================
            // Update Student Classification
            // =============================================
            await Student.updateClassification(
                connection,
                data.student_id,
                data.assessment_classification
            );

            // =============================================
            // Update Student Current Level
            // =============================================
            await Student.updateCurrentLevel(
                connection,
                data.student_id,
                data.recommended_level
            );

            // =============================================
            // Update Last Activity
            // =============================================
            await Student.updateLastActivity(
                connection,
                data.student_id
            );

            // =============================================
            // Create Exercise Plan
            // =============================================
            await ExercisePlan.create(
                connection,
                {
                    student_id: data.student_id,
                    assessment_id: assessmentId,
                    current_level:
                        data.recommended_level,
                }
            );

            // =============================================
            // Initialize Student Progress
            // =============================================
            await Student.initializeProgress(
                connection,
                {
                    studentId: data.student_id,
                    currentLevel: data.recommended_level,
                    classification: data.assessment_classification,
                }
            );

            // =============================================
            // Commit
            // =============================================
            await connection.commit();
            return await Assessment.findById(
                assessmentId
            );
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }

    // =====================================================
    // Assessment History
    // =====================================================
    static async getStudentHistory(studentId) {
        return await Assessment.findByStudent(
            studentId
        );
    }

    // =====================================================
    // Get Assessment
    // =====================================================
    static async getAssessment(id) {
        return await Assessment.findById(id);
    }
}

module.exports = AssessmentService;