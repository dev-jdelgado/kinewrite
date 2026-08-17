const Assessment =
    require("../models/Assessment");

const AssessmentAttempt =
    require("../models/AssessmentAttempt");

const HandwritingSample =
    require("../models/HandwritingSample");

const AssessmentAnalysis =
    require("../models/AssessmentAnalysis");


const ReferenceFitAnalyzer =
    require("../utils/handwriting/ReferenceFitAnalyzer");

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

        referenceImage,

        strokes,

        guide,

    }) {

        const attemptId =
            await AssessmentAttempt.create({

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

            });


        await HandwritingSample.create({

            attemptId,

            imagePath:
                image,

            strokeJson:
                strokes,

            guideJson: {

                referenceImage,

                metrics:
                    guide,

            },

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

        const samples =
            await Promise.all(

                attempts.map(
                    async attempt => {

                        const sample =
                            await HandwritingSample.findByAttempt(

                                attempt.attempt_id

                            );


                        return {

                            attempt,

                            sample,

                        };

                    }
                )

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


        for (
            const item of samples
        ) {

            const {

                attempt,

                sample,

            } = item;


            const category =
                attempt.activity_category
                    ?.trim()
                    .toLowerCase();


            if (
                !categories[category]
            ) {

                continue;

            }


            if (
                !sample
            ) {

                continue;

            }


            categories[category]
                .attempts
                .push(
                    attempt
                );


            categories[category]
                .samples
                .push(
                    sample
                );


            if (
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



        return categories;

    }



    // ==========================================
    // Analyze Assessment
    // ==========================================

    static async analyzeAssessment(

        assessmentId

    ) {

        // ==========================================
        // Load Attempts
        // ==========================================

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
        // Load Samples
        // ==========================================

        const samples =
            await this.loadHandwritingSamples(

                attempts

            );


        // ==========================================
        // Categorize
        // ==========================================

        const categories =
            this.categorizeActivities(

                samples

            );


        // ==========================================
        // Determine Available Categories
        // ==========================================

        const hasAlignment =
            categories.alignment.strokes.length > 0;

        const hasSpacing =
            categories.spacing.strokes.length > 0;

        const hasStroke =
            categories.stroke.strokes.length > 0;



        // ==========================================
        // Validate Categories
        // ==========================================

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
        //
        // KEEP ALIGNMENT UNCHANGED
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
        //
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

        const strokeGeometry =

            hasStroke

                ? HandwritingAnalyzer.analyze(

                    categories.stroke,

                    {
                        category: "stroke",
                    }

                )

                : null;


        const strokeReference =

            hasStroke
            
                ? ReferenceFitAnalyzer.analyze({
            
                    samples:
                        categories.stroke.samples,
            
                    options: {
            
                        preserveCanvasPosition:
                            true,
            
                        toleranceRadius:
                            10,
            
                        maxDistance:
                            24,
            
                        referenceThreshold:
                            245,
            
                    },
            
                })
            
                : null;


        // ==========================================
        // Stroke Final Score
        //
        // Reference = PRIMARY
        // Geometry = SECONDARY
        // ==========================================

        const strokeAnalysis =

            strokeGeometry

                ? {

                    ...strokeGeometry,

                    category:
                        "stroke",

                    score:
                        Number(

                            (

                                (
                                    (
                                        strokeReference?.valid
                                            ? strokeReference.score
                                            : strokeGeometry.score

                                    )

                                    *

                                    0.85
                                )

                                +

                                (

                                    strokeGeometry.score

                                    *

                                    0.15
                                )

                            ).toFixed(2)

                        ),

                    referenceFit:
                        strokeReference,

                    strokeMetrics:
                        strokeGeometry,

                }

                : null;


        // ==========================================
        // Calculate Overall Assessment
        // ==========================================

        const analysis =
            ScoreCalculator.calculate({

                alignment:
                    alignmentAnalysis,

                spacing:
                    spacingAnalysis,

                stroke:
                    strokeAnalysis,

            });


        // ==========================================
        // Save Assessment Analysis
        // ==========================================

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


        // ==========================================
        // Update Assessment
        // ==========================================

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
        // Update Student Progress
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


module.exports =
    AssessmentService;