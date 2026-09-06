const express = require("express");

const router = express.Router();

const studentController = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all students
router.get(
    "/",
    authMiddleware,
    studentController.getStudents
);

// Get one student
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

// Archive student
router.delete(
    "/:id",
    authMiddleware,
    studentController.archiveStudent
);

module.exports = router;