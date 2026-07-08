import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import PageContainer from "../components/common/PageContainer";
import Loader from "../components/common/Loader";
import BackButton from "../components/common/BackButton";
import ConfirmDialog from "../components/common/ConfirmDialog";

import StudentToolbar from "../components/student/StudentToolbar";
import StudentList from "../components/student/StudentList";
import EmptyStudents from "../components/student/EmptyStudents";
import StudentFormModal from "../components/student/StudentFormModal";

import { useStudents } from "../contexts/StudentContext";

const StudentManagement = () => {

    const {
        students,
        loading,
        archiveStudent,
    } = useStudents();

    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
    const [studentToArchive, setStudentToArchive] = useState(null);
    const filteredStudents = students.filter((student) => {
        const fullName =
            `${student.student_fname} ${student.student_lname}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
    });

    const handleAddStudent = () => {
        setSelectedStudent(null);
        setModalOpen(true);
    };

    const handleEditStudent = (student) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

    const handleArchiveClick = (student) => {
        setStudentToArchive(student);
        setArchiveDialogOpen(true);
    };

    const confirmArchive = async () => {
        if (!studentToArchive) return;
        await archiveStudent(studentToArchive.student_id);
        setArchiveDialogOpen(false);
        setStudentToArchive(null);
    };

    const cancelArchive = () => {
        setArchiveDialogOpen(false);
        setStudentToArchive(null);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <DashboardLayout>
            <DashboardHeader />
            <PageContainer className="pb-0">
                <BackButton />
            </PageContainer>

            <PageContainer className="pt-6">
                <StudentToolbar
                    search={search}
                    setSearch={setSearch}
                    onAddStudent={handleAddStudent}
                />
                {
                    filteredStudents.length === 0
                        ?
                        (
                            <EmptyStudents
                                onCreate={handleAddStudent}
                            />
                        )
                        :
                        (
                            <StudentList
                                students={filteredStudents}
                                onEdit={handleEditStudent}
                                onArchive={handleArchiveClick}
                            />
                        )
                }
            </PageContainer>

            <StudentFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                student={selectedStudent}
            />

            <ConfirmDialog
                open={archiveDialogOpen}
                title="Archive Student"
                message={
                    studentToArchive
                        ? `Are you sure you want to archive ${studentToArchive.student_fname} ${studentToArchive.student_lname}? This student can be restored later.`
                        : ""
                }
                confirmText="Archive Student"
                cancelText="Cancel"
                confirmColor="bg-red-600 hover:bg-red-700"
                onConfirm={confirmArchive}
                onCancel={cancelArchive}
            />
        </DashboardLayout>
    );
};

export default StudentManagement;