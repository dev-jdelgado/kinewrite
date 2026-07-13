const express = require("express");
const router = express.Router();
const assessmentController = require("../controllers/assessmentController");

// ======================================================
// Assessment Routes
// ======================================================

// Create Assessment
router.post(
    "/",
    assessmentController.createAssessment
);

// Get Assessment by ID
router.get(
    "/:id",
    assessmentController.getAssessment
);

// Get Student Assessment History
router.get(
    "/student/:studentId",
    assessmentController.getStudentHistory
);

module.exports = router;