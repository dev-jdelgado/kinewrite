const AssessmentService = require("../services/AssessmentService");

const assessmentController = {

    // =====================================================
    // Complete Assessment
    // POST /api/assessments
    // =====================================================
    async createAssessment(req, res) {

        try {
            const {
                student_id,
                assessment_type,
                visual_motor_score,
                fine_motor_score,
                letter_formation_score,
                assessment_score,
                assessment_classification,
                recommended_level,
                assessment_remarks,
            } = req.body;

            // =============================================
            // Basic Validation
            // =============================================
            if (!student_id) {
                return res.status(400).json({
                    success: false,
                    message: "Student ID is required.",
                });
            }

            if (!assessment_type) {
                return res.status(400).json({
                    success: false,
                    message: "Assessment type is required.",
                });
            }

            const assessment = await AssessmentService.completeAssessment({
                student_id,
                assessment_type,
                visual_motor_score,
                fine_motor_score,
                letter_formation_score,
                assessment_score,
                assessment_classification,
                recommended_level,
                assessment_remarks,
            });

            return res.status(201).json({
                success: true,
                message: "Assessment completed successfully.",
                data: assessment,
            });
        }

        catch (error) {
            console.error("Assessment Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to complete assessment.",
                error: error.message,
            });
        }
    },

    // =====================================================
    // Get Assessment By ID
    // GET /api/assessments/:id
    // =====================================================
    async getAssessment(req, res) {

        try {
            const assessment =
                await AssessmentService.getAssessment(
                    req.params.id
                );
            if (!assessment) {
                return res.status(404).json({
                    success: false,
                    message: "Assessment not found.",
                });
            }

            return res.status(200).json({
                success: true,
                data: assessment,
            });
        }

        catch (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve assessment.",
                error: error.message,
            });
        }
    },

    // =====================================================
    // Get Student Assessment History
    // GET /api/assessments/student/:studentId
    // =====================================================
    async getStudentHistory(req, res) {

        try {
            const history =
                await AssessmentService.getStudentHistory(
                    req.params.studentId
                );

            return res.status(200).json({
                success: true,
                count: history.length,
                data: history,
            });
        }

        catch (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve assessment history.",
                error: error.message,
            });
        }
    },
};

module.exports = assessmentController;