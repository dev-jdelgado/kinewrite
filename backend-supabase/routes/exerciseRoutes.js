const express = require("express");

const router = express.Router();

const exerciseController =
    require("../controllers/exerciseController");

router.post(
    "/session/start",
    exerciseController.startSession
);

router.post(
    "/attempt",
    exerciseController.saveAttempt
);

router.post(
    "/session/:sessionId/complete",
    exerciseController.completeSession
);

router.get(
    "/session/:sessionId",
    exerciseController.getSession
);

router.get(
    "/student/:studentId/history",
    exerciseController.getStudentHistory
);

module.exports = router;
