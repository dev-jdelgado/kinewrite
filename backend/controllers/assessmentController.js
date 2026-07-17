const AssessmentService = require("../services/AssessmentService");

class AssessmentController {

    // ==========================================
    // Start Assessment
    // ==========================================

    static async startAssessment(req, res) {

        try {

            const {

                studentId,

                assessmentType,

            } = req.body;

            const assessmentId =
                await AssessmentService.startAssessment({

                    studentId,

                    assessmentType,

                });

            return res.status(201).json({

                success: true,

                message:
                    "Assessment started successfully.",

                data: {

                    assessmentId,

                },

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message:
                    "Failed to start assessment.",

            });

        }

    }

    // ==========================================
    // Save Activity
    // ==========================================

    static async saveActivity(req, res) {

        try {

            const {

                assessmentId,

            } = req.params;

            const {

                activityNo,

                activityCategory,

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

            console.error(error);

            return res.status(500).json({

                success: false,

                message:
                    "Failed to save activity.",

            });

        }

    }

    // ==========================================
    // Analyze Assessment
    // ==========================================

    static async analyzeAssessment(req, res) {

        try {

            const {

                assessmentId,

            } = req.params;

            const analysis =
                await AssessmentService.analyzeAssessment(

                    assessmentId

                );

            return res.status(200).json({

                success: true,

                message:
                    "Assessment analyzed successfully.",

                data: analysis,

            });

        } catch (error) {

            console.error(error);

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

    static async getAssessment(req, res) {

        try {

            const {

                assessmentId,

            } = req.params;

            const assessment =
                await AssessmentService.getAssessment(

                    assessmentId

                );

            return res.status(200).json({

                success: true,

                data: assessment,

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message:
                    "Failed to retrieve assessment.",

            });

        }

    }

    // ==========================================
    // Student Assessment History
    // ==========================================

    static async getStudentAssessments(req, res) {

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

                data: assessments,

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message:
                    "Failed to retrieve assessments.",

            });

        }

    }

}

module.exports = AssessmentController;