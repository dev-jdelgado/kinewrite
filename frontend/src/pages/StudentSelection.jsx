import React from "react";

import PageContainer from "../components/common/PageContainer";
import PageHeader from "../components/common/PageHeader";

import StudentGrid from "../components/student/StudentGrid";
import StudentCard from "../components/student/StudentCard";
import AddStudentCard from "../components/AddStudentCard";
import EmptyStudents from "../components/student/EmptyStudents";

const mockStudents = [
    {
        student_id: 1,
        student_fname: "John",
        student_lname: "Dela Cruz",
        student_gender: "Male",
        student_grade_level: 1,
        student_classification: "Pending",
        student_current_level: 1,
    },
    {
        student_id: 2,
        student_fname: "Maria",
        student_lname: "Santos",
        student_gender: "Female",
        student_grade_level: 1,
        student_classification: "Mild",
        student_current_level: 3,
    },
    {
        student_id: 3,
        student_fname: "Christian",
        student_lname: "Reyes",
        student_gender: "Male",
        student_grade_level: 1,
        student_classification: "Moderate",
        student_current_level: 5,
    },
];

const StudentSelection = () => {
    const handleStudentClick = (student) => {
        console.log(student);
    };

    const handleCreateStudent = () => {
        console.log("Create Student");
    };

    return (
        <PageContainer>
            <PageHeader
                title="Who's Practicing Today?"
                subtitle="Choose a student to begin handwriting therapy."
            />

            {mockStudents.length === 0 ? (
                <EmptyStudents
                    onCreate={handleCreateStudent}
                />
            ) : (
                <StudentGrid>
                    {mockStudents.map((student) => (
                        <StudentCard
                            key={student.student_id}
                            student={student}
                            onClick={() =>
                                handleStudentClick(student)
                            }
                        />
                    ))}

                    <AddStudentCard
                        onClick={handleCreateStudent}
                    />
                </StudentGrid>
            )}
        </PageContainer>
    );
};

export default StudentSelection;