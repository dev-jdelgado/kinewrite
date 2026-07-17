const Assessment = require("../models/Assessment");
const AssessmentAttempt = require("../models/AssessmentAttempt");
const HandwritingSample = require("../models/HandwritingSample");
const AssessmentAnalysis = require("../models/AssessmentAnalysis");

const HandwritingAnalyzer =
    require("../utils/HandwritingAnalyzer");

const Student =
    require("../models/Student");

const pool =
    require("../config/db");

class AssessmentService {

    // ==========================================
    // Start Assessment
    // ==========================================

    static async startAssessment({

        studentId,

        assessmentType,

    }) {

        return await Assessment.create({

            studentId,

            assessmentType,

        });

    }

    // ==========================================
    // Save Activity
    // ==========================================

    static async saveActivity({

        assessmentId,

        activityNo,

        activityCategory,

        promptText,

        promptType,

        completionTime,

        penLifts,

        strokeCount,

        image,

        strokes,

    }) {

        const attemptId =
            await AssessmentAttempt.create({

                assessmentId,

                activityNo,

                activityCategory,

                promptText,

                promptType,

                completionTime,

                penLifts,

                strokeCount,

            });

        await HandwritingSample.create({

            attemptId,

            imagePath: image,

            strokeJson: strokes,

        });

        return attemptId;

    }

    // ==========================================
    // Analyze Assessment
    // ==========================================

    static async analyzeAssessment(

        assessmentId

    ) {

        const attempts =
            await AssessmentAttempt.findByAssessment(

                assessmentId

            );

        let allStrokes = [];

        for (const attempt of attempts) {

            const sample =
                await HandwritingSample.findByAttempt(

                    attempt.attempt_id

                );

            if (

                sample &&

                sample.stroke_json

            ) {

                allStrokes.push(

                    ...sample.stroke_json

                );

            }

        }

        if (!allStrokes.length) {

            throw new Error(

                "No handwriting samples found."

            );

        }

        const analysis =
            HandwritingAnalyzer.analyze(

                allStrokes

            );

        await AssessmentAnalysis.create({

            assessmentId,
            
            spacingScore:
                analysis.spacing.score,
            
            alignmentScore:
                analysis.alignment.score,
            
            strokeScore:
                analysis.stroke.score,
            
            overallScore:
                analysis.overallScore,
            
            classification:
                analysis.classification,
            
        });

        await Assessment.updateScores({

            assessmentId,
        
            spacingScore:
                analysis.spacing.score,
        
            alignmentScore:
                analysis.alignment.score,
        
            strokeScore:
                analysis.stroke.score,
        
            overallScore:
                analysis.overallScore,
        
            classification:
                analysis.classification,
        
            recommendedLevel:
                analysis.therapyLevel,
        
            remarks:
                analysis.remarks,
        
        });

        // ==========================================
        // Update Student
        // ==========================================

        const assessment =

            await Assessment.findById(

                assessmentId

            );

        const connection = await pool.getConnection();

            try {
            
                await connection.beginTransaction();
            
                await Student.initializeProgress(connection, {
                    studentId: assessment.student_id,
                    currentLevel: analysis.therapyLevel,
                    classification: analysis.classification,
                });
                
                await Student.completeAssessment(connection, {
                    studentId: assessment.student_id,
                    assessmentId,
                    classification: analysis.classification,
                    level: analysis.therapyLevel,
                    accuracy: analysis.overallScore,
                });
            
                await connection.commit();
            
            } catch (error) {
            
                await connection.rollback();
                throw error;
            
            } finally {
            
                connection.release();
            
            }

        console.log(
            JSON.stringify(
                analysis,
                null,
                2
            )
        );

        return analysis;

    }

    // ==========================================
    // Get Assessment
    // ==========================================

    static async getAssessment(

        assessmentId

    ) {

        const assessment =
            await Assessment.findById(

                assessmentId

            );

        const attempts =
            await AssessmentAttempt.findByAssessment(

                assessmentId

            );

        const analysis =
            await AssessmentAnalysis.findByAssessment(

                assessmentId

            );

        return {

            assessment,

            attempts,

            analysis,

        };

    }

    // ==========================================
    // Student Assessment History
    // ==========================================

    static async getStudentAssessments(

        studentId

    ) {

        return await Assessment.findByStudent(

            studentId

        );

    }

}

module.exports = AssessmentService;