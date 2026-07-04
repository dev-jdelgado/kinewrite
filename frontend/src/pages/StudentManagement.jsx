import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import PageContainer from "../components/common/PageContainer";
import Loader from "../components/common/Loader";
import BackButton from "../components/common/BackButton";
import StudentToolbar from "../components/student/StudentToolbar";
import StudentList from "../components/student/StudentList";
import EmptyStudents from "../components/student/EmptyStudents";
import StudentFormModal from "../components/student/StudentFormModal";

import { useStudents } from "../contexts/StudentContext";

const StudentManagement = () => {

    const navigate = useNavigate();

    const {
        students,
        loading,
        archiveStudent
    } = useStudents();

    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const filteredStudents = students.filter((student) => {
        const fullname =
            `${student.student_fname} ${student.student_lname}`.toLowerCase();
        return fullname.includes(search.toLowerCase());
    });

    const handleAddStudent = () => {
        setSelectedStudent(null);
        setModalOpen(true);
    };

    const handleEditStudent = (student) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

    const handleArchiveStudent = async (student) => {
        const confirmArchive = window.confirm(
            `Archive ${student.student_fname} ${student.student_lname}?`
        );
        if (!confirmArchive) return;
        await archiveStudent(student.student_id);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <DashboardLayout>
            
            <DashboardHeader />
            <PageContainer>
                <BackButton />
                    <StudentToolbar
                        search={search}
                        setSearch={setSearch}
                        onAddStudent={handleAddStudent}
                    />
                    {
                        filteredStudents.length === 0 ?
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
                                    onArchive={handleArchiveStudent}
                                />
                            )
                    }

                    <StudentFormModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        student={selectedStudent}
                    />
            </PageContainer>
        </DashboardLayout>
    );
};

export default StudentManagement;