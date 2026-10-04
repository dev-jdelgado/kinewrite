const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, studentController.getStudents);
router.get("/archived", authMiddleware, studentController.getArchivedStudents);
router.get("/:id", authMiddleware, studentController.getStudentById);
router.post("/", authMiddleware, studentController.createStudent);
router.put("/:id", authMiddleware, studentController.updateStudent);
router.put("/:id/restore", authMiddleware, studentController.restoreStudent);
router.delete("/:id", authMiddleware, studentController.archiveStudent);

module.exports = router;
