const express = require("express");

const router = express.Router();

const AssessmentController =
    require("../controllers/AssessmentController");

// ==========================================
// Assessment
// ==========================================

// Start Assessment
router.post(
    "/start",
    AssessmentController.startAssessment
);

// Save Activity
router.post(
    "/:assessmentId/activity",
    AssessmentController.saveActivity
);

// Analyze Assessment
router.post(
    "/:assessmentId/analyze",
    AssessmentController.analyzeAssessment
);

// Get Assessment
router.get(
    "/:assessmentId",
    AssessmentController.getAssessment
);

// Student Assessment History
router.get(
    "/student/:studentId",
    AssessmentController.getStudentAssessments
);

module.exports = router;