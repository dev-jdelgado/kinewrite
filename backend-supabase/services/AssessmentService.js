const Assessment = require("../models/Assessment");
const AssessmentAttempt = require("../models/AssessmentAttempt");
const HandwritingSample = require("../models/HandwritingSample");
const AssessmentAnalysis = require("../models/AssessmentAnalysis");

const HandwritingAnalyzer =
    require("../utils/HandwritingAnalyzer");

const ScoreCalculator =
    require("../utils/handwriting/ScoreCalculator");

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

        activityName,

        activityType,

        promptText,

        promptType,

        completionTime,

        penLifts,

        strokeCount,

        image,

        strokes,

    }) {

        // ==========================================
        // Validate Assessment ID
        // ==========================================

        const numericAssessmentId =
            Number(assessmentId);


        if (
            !Number.isInteger(numericAssessmentId) ||
            numericAssessmentId <= 0
        ) {

            throw new Error(
                "Invalid assessment ID."
            );

        }


        // ==========================================
        // Normalize Activity Category
        // ==========================================

        const normalizedCategory =

            String(
                activityCategory || ""
            )
                .trim()
                .toLowerCase();


        let databaseCategory;


        switch (normalizedCategory) {

            case "spacing":

                databaseCategory =
                    "Spacing";

                break;


            case "alignment":

                databaseCategory =
                    "Alignment";

                break;


            case "stroke":

                databaseCategory =
                    "Stroke";

                break;


            default:

                throw new Error(
                    `Invalid activity category: ${activityCategory}`
                );

        }


        // ==========================================
        // Create Assessment Attempt
        // ==========================================

        const attemptId =
            await AssessmentAttempt.create({

                assessmentId:
                    numericAssessmentId,

                activityNo,

                activityCategory:
                    databaseCategory,

                activityName,

                activityType,

                promptText,

                promptType,

                completionTime,

                penLifts,

                strokeCount,

            });


        // ==========================================
        // Save Handwriting Sample
        // ==========================================

        await HandwritingSample.create({

            attemptId,

            imagePath:
                image,

            strokeJson:
                strokes,

        });


        return attemptId;

    }

    // ==========================================
    // Load Assessment Attempts
    // ==========================================

    static async loadAssessmentAttempts(

        assessmentId

    ) {

        return await AssessmentAttempt.findByAssessment(

            assessmentId

        );

    }

    // ==========================================
    // Load Samples
    // ==========================================

    static async loadHandwritingSamples(

        attempts

    ) {

        const samples = await Promise.all(

            attempts.map(async attempt => {

                const sample =

                    await HandwritingSample.findByAttempt(

                        attempt.attempt_id

                    );

                return {

                    attempt,

                    sample,

                };

            })

        );

        return samples;

    }


    // ==========================================
    // Categorize Activities
    // ==========================================

    static categorizeActivities(

        samples

    ) {

        const categories = {

            alignment: {

                attempts: [],
            
                samples: [],
            
                strokes: [],
            
            },

            spacing: {

                attempts: [],
            
                samples: [],
            
                strokes: [],

            },

            stroke: {

                attempts: [],
            
                samples: [],
            
                strokes: [],

            },

        };

        for (const item of samples) {

            const {

                attempt,

                sample,

            } = item;

            const category =
                attempt.activity_category
                    ?.trim()
                    .toLowerCase();
            
            console.log("================================");
            console.log("Category:", category);
            console.log("Attempt ID:", attempt.attempt_id);
            console.log("Sample:", sample);
            console.log("Stroke JSON:", sample?.stroke_json);
            console.log("Is Array:", Array.isArray(sample?.stroke_json));
            
            if (
                !categories[category]
            ) {
                continue;
            }

            categories[category]

                .attempts

                .push(attempt);

            categories[category]

                .samples
                
                .push(sample);

            if (

                sample &&

                Array.isArray(

                    sample.stroke_json

                )

            ) {

                categories[category]

                    .strokes

                    .push(

                        ...sample.stroke_json

                    );

            }

        }

        
        console.log("===== CATEGORY TOTALS =====");
        console.log("Alignment:", categories.alignment.strokes.length);
        console.log("Spacing:", categories.spacing.strokes.length);
        console.log("Stroke:", categories.stroke.strokes.length);
        
        return categories;

    }

    // ==========================================
    // Analyze Assessment
    // ==========================================

    static async analyzeAssessment(

        assessmentId

    ) {

        const attempts =
            await this.loadAssessmentAttempts(
        
                assessmentId
        
            );
        
        if (
        
            attempts.length === 0
        
        ) {
        
            throw new Error(
        
                "No assessment attempts found."
        
            );
        
        }
        
        // ==========================================
        // Load Handwriting Samples
        // ==========================================
        
        const samples =
            await this.loadHandwritingSamples(
        
                attempts
        
            );

        // ==========================================
        // Categorize Activities
        // ==========================================
        
        const categories =
            this.categorizeActivities(
        
                samples
        
            );
        
        // ==========================================
        // Validate Categories
        // ==========================================
        
        const hasAlignment =
        
            categories.alignment.strokes.length > 0;
        
        const hasSpacing =
        
            categories.spacing.strokes.length > 0;
        
        const hasStroke =
        
            categories.stroke.strokes.length > 0;
        
        if (
        
            !hasAlignment &&
        
            !hasSpacing &&
        
            !hasStroke
        
        ) {
    
        throw new Error(
    
            "No handwriting samples were found."
    
        );
    
    }

        // ==========================================
        // Analyze Alignment
        // ==========================================

        const alignmentAnalysis =

            hasAlignment

                ? HandwritingAnalyzer.analyze(

                    categories.alignment,

                    {

                        category: "alignment",

                    }

                )

                : null;

        // ==========================================
        // Analyze Spacing
        // ==========================================

        const spacingAnalysis =

            hasSpacing

                ? HandwritingAnalyzer.analyze(

                    categories.spacing,

                    {

                        category: "spacing",

                    }

                )

                : null;

        // ==========================================
        // Analyze Stroke
        // ==========================================

        const strokeAnalysis =

            hasStroke

                ? HandwritingAnalyzer.analyze(

                    categories.stroke,

                    {

                        category: "stroke",

                    }

                )

                : null;


        // ==========================================
        // Calculate Overall Assessment
        // ==========================================

        const analysis = ScoreCalculator.calculate({

            alignment: alignmentAnalysis,

            spacing: spacingAnalysis,

            stroke: strokeAnalysis,

        });

        await AssessmentAnalysis.create({

            assessmentId,
        
            alignmentScore:
                analysis.breakdown.alignment?.score ?? 0,
        
            spacingScore:
                analysis.breakdown.spacing?.score ?? 0,
        
            strokeScore:
                analysis.breakdown.stroke?.score ?? 0,
        
            overallScore:
                analysis.overallScore,
        
            classification:
                analysis.classification,
        
        });

        await Assessment.updateScores({

            assessmentId,
        
            alignmentScore:
                analysis.breakdown.alignment?.score ?? 0,
            
            spacingScore:
                analysis.breakdown.spacing?.score ?? 0,
            
            strokeScore:
                analysis.breakdown.stroke?.score ?? 0,
        
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

        const connection = await pool.connect();

            try {
            
                await connection.query("BEGIN");
            
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
            
                await connection.query("COMMIT");
            
            } catch (error) {
            
                await connection.query("ROLLBACK");
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