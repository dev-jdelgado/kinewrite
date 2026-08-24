const express = require("express");

const router = express.Router();
const exerciseController = require("../controllers/exerciseController");

router.post("/session/start", exerciseController.startSession);
router.get("/session/:sessionId", exerciseController.getSession);
router.post("/session/:sessionId/complete", exerciseController.completeSession);
router.post("/attempt", exerciseController.saveAttempt);
router.get("/student/:studentId/history", exerciseController.getStudentHistory);

module.exports = router;
