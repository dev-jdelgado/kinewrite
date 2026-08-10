const AssessmentService =
    require("../services/AssessmentService");


class AssessmentController {

    // ==========================================
    // Validate Assessment ID
    // ==========================================

    static getValidAssessmentId(
        assessmentId
    ) {

        const numericAssessmentId =
            Number(
                assessmentId
            );


        if (
            !Number.isInteger(
                numericAssessmentId
            ) ||
            numericAssessmentId <= 0
        ) {

            return null;

        }


        return numericAssessmentId;

    }


    // ==========================================
    // Start Assessment
    // ==========================================

    static async startAssessment(
        req,
        res
    ) {

        try {

            const {
                studentId,
                assessmentType,
            } = req.body;


            if (
                !studentId ||
                studentId === "null" ||
                studentId === "undefined"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "A valid student ID is required.",

                });

            }


            const normalizedAssessmentType =

                assessmentType === "Post-Test"

                    ? "Post-Test"

                    : assessmentType === "Pre-Test"

                        ? "Pre-Test"

                        : assessmentType === "post"

                            ? "Post-Test"

                            : "Pre-Test";


            const assessmentId =
                await AssessmentService.startAssessment({

                    studentId,

                    assessmentType:
                        normalizedAssessmentType,

                });


            const numericAssessmentId =
                Number(
                    assessmentId
                );


            if (
                !Number.isInteger(
                    numericAssessmentId
                ) ||
                numericAssessmentId <= 0
            ) {

                throw new Error(
                    "Failed to create a valid assessment ID."
                );

            }


            return res.status(201).json({

                success: true,

                message:
                    "Assessment started successfully.",

                data: {

                    assessmentId:
                        numericAssessmentId,

                },

            });

        } catch (error) {

            console.error(
                "Start Assessment Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Failed to start assessment.",

            });

        }

    }


    // ==========================================
    // Save Activity
    // ==========================================

    static async saveActivity(
        req,
        res
    ) {

        try {

            const {
                assessmentId,
            } = req.params;


            const numericAssessmentId =
                this.getValidAssessmentId(
                    assessmentId
                );


            if (
                numericAssessmentId === null
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid assessment ID.",

                });

            }


            const {

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

            } = req.body;


            const attemptId =
                await AssessmentService.saveActivity({

                    assessmentId:
                        numericAssessmentId,

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

                });


            return res.status(201).json({

                success: true,

                message:
                    "Activity saved successfully.",

                data: {

                    attemptId,

                },

            });

        } catch (error) {

            console.error(
                "Save Activity Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Failed to save activity.",

            });

        }

    }


    // ==========================================
    // Analyze Assessment
    // ==========================================

    static async analyzeAssessment(
        req,
        res
    ) {

        try {

            const {
                assessmentId,
            } = req.params;


            const numericAssessmentId =
                this.getValidAssessmentId(
                    assessmentId
                );


            if (
                numericAssessmentId === null
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid assessment ID.",

                });

            }


            const analysis =
                await AssessmentService.analyzeAssessment(

                    numericAssessmentId

                );


            return res.status(200).json({

                success: true,

                message:
                    "Assessment analyzed successfully.",

                data:
                    analysis,

            });

        } catch (error) {

            console.error(
                "Analyze Assessment Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Failed to analyze assessment.",

            });

        }

    }


    // ==========================================
    // Get Assessment
    // ==========================================

    static async getAssessment(
        req,
        res
    ) {

        try {

            const {
                assessmentId,
            } = req.params;


            const numericAssessmentId =
                this.getValidAssessmentId(
                    assessmentId
                );


            if (
                numericAssessmentId === null
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid assessment ID.",

                });

            }


            const assessment =
                await AssessmentService.getAssessment(

                    numericAssessmentId

                );


            return res.status(200).json({

                success: true,

                data:
                    assessment,

            });

        } catch (error) {

            console.error(
                "Get Assessment Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Failed to retrieve assessment.",

            });

        }

    }


    // ==========================================
    // Student Assessment History
    // ==========================================

    static async getStudentAssessments(
        req,
        res
    ) {

        try {

            const {
                studentId,
            } = req.params;


            const assessments =
                await AssessmentService.getStudentAssessments(

                    studentId

                );


            return res.status(200).json({

                success: true,

                data:
                    assessments,

            });

        } catch (error) {

            console.error(
                "Get Student Assessments Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Failed to retrieve assessments.",

            });

        }

    }

}


module.exports =
    AssessmentController;