const generateStudentCode = (studentId) => {
    return `STU-${String(studentId).padStart(6, "0")}`;
};

module.exports = generateStudentCode;