import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import PageContainer from "../components/common/PageContainer";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import BackButton from "../components/common/BackButton";
import Loader from "../components/common/Loader";

import StudentRecordsToolbar from "../components/student-records/StudentRecordsToolbar";
import StudentRecordsTable from "../components/student-records/StudentRecordsTable";

import { useStudents } from "../contexts/StudentContext";

const StudentRecords = () => {

    const navigate = useNavigate();
    const { students, loading } = useStudents();
    const [search, setSearch] = useState("");
    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const keyword = search.toLowerCase();
            return (
                student.student_fname
                    .toLowerCase()
                    .includes(keyword) ||

                student.student_lname
                    .toLowerCase()
                    .includes(keyword) ||

                student.student_code
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [students, search]);

    const handleViewStudent = (student) => {
        navigate(`/student-records/${student.student_id}`);
    };

    return (

        <DashboardLayout>
            <DashboardHeader />

            <PageContainer>
                <BackButton className="mb-6"/>
                <StudentRecordsToolbar
                    search={search}
                    setSearch={setSearch}
                />
                {
                    loading
                        ?
                        (
                            <Loader />
                        )
                        :
                        (
                            <StudentRecordsTable
                                students={filteredStudents}
                                onView={handleViewStudent}
                            />
                        )
                }
            </PageContainer>
        </DashboardLayout>
    );
};

export default StudentRecords;