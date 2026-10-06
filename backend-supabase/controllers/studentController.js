const db = require("../config/db");
const Student = require("../models/Student");
const generateStudentCode = require("../utils/generateStudentCode");

const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

const isAtLeastNineYearsOld = (birthDateValue) => {
    if (!birthDateValue) return false;

    const birthDate = new Date(`${birthDateValue}T00:00:00`);
    if (Number.isNaN(birthDate.getTime())) return false;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const birthdayPassed =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
            today.getDate() >= birthDate.getDate());

    if (!birthdayPassed) age -= 1;
    return age >= 9;
};

const validateStudent = ({
    student_fname,
    student_lname,
    student_gender,
    student_bday,
    student_grade_level,
}) => {
    if (
        !student_fname ||
        !student_lname ||
        !student_gender ||
        !student_bday ||
        !student_grade_level
    ) {
        return "Please complete all required fields.";
    }

    if (
        !namePattern.test(student_fname.trim()) ||
        !namePattern.test(student_lname.trim())
    ) {
        return "Student names may contain letters, spaces, hyphens, and apostrophes only.";
    }

    if (!isAtLeastNineYearsOld(student_bday)) {
        return "Student must be at least 9 years old.";
    }

    return null;
};

exports.getStudents = async (req, res) => {
    try {
        const schoolId = req.user.school_id;
        const students = await Student.findAll(schoolId);

        res.json({
            success: true,
            message: "Students retrieved successfully.",
            data: { total: students.length, students },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getArchivedStudents = async (req, res) => {
    try {
        const schoolId = req.user.school_id;
        const students = await Student.findArchived(schoolId);

        res.json({
            success: true,
            message: "Archived students retrieved successfully.",
            data: { total: students.length, students },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id, req.user.school_id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found.",
            });
        }

        res.json({
            success: true,
            message: "Student retrieved successfully.",
            data: { student },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createStudent = async (req, res) => {
    let connection;
    let transactionStarted = false;

    try {
        const {
            student_fname,
            student_lname,
            student_gender,
            student_bday,
            student_grade_level,
            student_notes,
        } = req.body;

        const validationError = validateStudent({
            student_fname,
            student_lname,
            student_gender,
            student_bday,
            student_grade_level,
        });

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError,
            });
        }

        connection = await db.connect();
        await connection.query("BEGIN");
        transactionStarted = true;

        const schoolId = req.user.school_id;
        const studentId = await Student.create(connection, {
            school_id: schoolId,
            student_fname: student_fname.trim(),
            student_lname: student_lname.trim(),
            student_gender,
            student_bday,
            student_grade_level,
            student_notes,
        });

        const studentCode = generateStudentCode(studentId);
        await Student.updateStudentCode(connection, studentId, studentCode);
        await Student.initializeProgress(connection, {
            studentId,
            currentLevel: 1,
            classification: "Not Assessed",
        });

        await connection.query("COMMIT");
        transactionStarted = false;

        const student = await Student.findById(studentId, schoolId);

        res.status(201).json({
            success: true,
            message: "Student created successfully.",
            data: { student },
        });
    } catch (error) {
        if (connection && transactionStarted) {
            await connection.query("ROLLBACK");
        }

        res.status(500).json({ success: false, message: error.message });
    } finally {
        if (connection) connection.release();
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const {
            student_fname,
            student_lname,
            student_gender,
            student_bday,
            student_grade_level,
            student_notes,
        } = req.body;

        const validationError = validateStudent({
            student_fname,
            student_lname,
            student_gender,
            student_bday,
            student_grade_level,
        });

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError,
            });
        }

        const schoolId = req.user.school_id;
        const student = await Student.findById(req.params.id, schoolId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found.",
            });
        }

        await Student.update(req.params.id, schoolId, {
            student_fname: student_fname.trim(),
            student_lname: student_lname.trim(),
            student_gender,
            student_bday,
            student_grade_level,
            student_notes,
        });

        const updatedStudent = await Student.findById(req.params.id, schoolId);

        res.json({
            success: true,
            message: "Student updated successfully.",
            data: { student: updatedStudent },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.archiveStudent = async (req, res) => {
    try {
        const schoolId = req.user.school_id;
        const student = await Student.findById(req.params.id, schoolId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found.",
            });
        }

        await Student.archive(req.params.id, schoolId);

        res.json({
            success: true,
            message: "Student archived successfully.",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.restoreStudent = async (req, res) => {
    try {
        const schoolId = req.user.school_id;
        const archivedStudents = await Student.findArchived(schoolId);
        const student = archivedStudents.find(
            (item) => String(item.student_id) === String(req.params.id)
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Archived student not found.",
            });
        }

        await Student.restore(req.params.id, schoolId);

        res.json({
            success: true,
            message: "Student restored successfully.",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
