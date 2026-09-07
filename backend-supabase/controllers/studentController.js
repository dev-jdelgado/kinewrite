const db = require("../config/db");
const Student = require("../models/Student");
const generateStudentCode = require("../utils/generateStudentCode");

// ========================================
// Get All Students
// ========================================

exports.getStudents = async (req, res) => {
    try {
        const schoolId = req.user.school_id;

        const students = await Student.findAll(schoolId);

        res.json({
            success: true,
            message: "Students retrieved successfully.",
            data: {
                total: students.length,
                students,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ========================================
// Get Student By ID
// ========================================

exports.getStudentById = async (req, res) => {
    try {
        const schoolId = req.user.school_id;

        const student = await Student.findById(
            req.params.id,
            schoolId
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found.",
            });
        }

        res.json({
            success: true,
            message: "Student retrieved successfully.",
            data: {
                student,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ========================================
// Create Student
// ========================================

exports.createStudent = async (req, res) => {
    const connection = await db.connect();

    try {
        const {
            student_fname,
            student_lname,
            student_gender,
            student_bday,
            student_grade_level,
            student_notes,
        } = req.body;

        if (
            !student_fname ||
            !student_lname ||
            !student_gender ||
            !student_bday ||
            !student_grade_level
        ) {
            return res.status(400).json({
                success: false,
                message: "Please complete all required fields.",
            });
        }

        await connection.query("BEGIN");

        const schoolId = req.user.school_id;

        const studentId = await Student.create(connection, {
            school_id: schoolId,
            student_fname,
            student_lname,
            student_gender,
            student_bday,
            student_grade_level,
            student_notes,
        });

        const studentCode = generateStudentCode(studentId);

        await Student.updateStudentCode(
            connection,
            studentId,
            studentCode
        );

        await Student.initializeProgress(
            connection,
            studentId
        );

        await connection.query("COMMIT");

        const student = await Student.findById(
            studentId,
            schoolId
        );

        res.status(201).json({
            success: true,
            message: "Student created successfully.",
            data: {
                student,
            },
        });

    } catch (error) {

        await connection.query("ROLLBACK");

        res.status(500).json({
            success: false,
            message: error.message,
        });

    } finally {

        connection.release();

    }
};

// ========================================
// Update Student
// ========================================

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

        const schoolId = req.user.school_id;

        const student = await Student.findById(
            req.params.id,
            schoolId
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found.",
            });
        }

        await Student.update(
            req.params.id,
            schoolId,
            {
                student_fname,
                student_lname,
                student_gender,
                student_bday,
                student_grade_level,
                student_notes,
            });

        const updatedStudent = await Student.findById(
            req.params.id,
            schoolId
        );

        res.json({
            success: true,
            message: "Student updated successfully.",
            data: {
                student: updatedStudent,
            },
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// ========================================
// Archive Student
// ========================================

exports.archiveStudent = async (req, res) => {

    try {

        const schoolId = req.user.school_id;

        const student = await Student.findById(
            req.params.id,
            schoolId
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found.",
            });
        }

        await Student.archive(
            req.params.id,
            schoolId
        );

        res.json({
            success: true,
            message: "Student archived successfully.",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};