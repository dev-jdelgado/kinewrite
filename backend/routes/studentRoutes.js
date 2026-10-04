const express = require("express");

const router = express.Router();

const studentController = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all active students
router.get(
    "/",
    authMiddleware,
    studentController.getStudents
);

// Get all archived students
router.get(
    "/archived",
    authMiddleware,
    studentController.getArchivedStudents
);

// Get one active student
router.get(
    "/:id",
    authMiddleware,
    studentController.getStudentById
);

// Create student
router.post(
    "/",
    authMiddleware,
    studentController.createStudent
);

// Update student
router.put(
    "/:id",
    authMiddleware,
    studentController.updateStudent
);

// Restore archived student
router.put(
    "/:id/restore",
    authMiddleware,
    studentController.restoreStudent
);

// Archive student
router.delete(
    "/:id",
    authMiddleware,
    studentController.archiveStudent
);

module.exports = router;
