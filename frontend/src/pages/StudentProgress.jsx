import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import PageContainer from "../components/common/PageContainer";
import BackButton from "../components/common/BackButton";
import Loader from "../components/common/Loader";

import StudentProfileHeader from "../components/student-progress/StudentProfileHeader";
import ProgressSummaryCards from "../components/student-progress/ProgressSummaryCards";
import AssessmentOverview from "../components/student-progress/AssessmentOverview";
import RecentSessionsTable from "../components/student-progress/RecentSessionsTable";
import GenerateReportCard from "../components/student-progress/GenerateReportCard";

import StudentService from "../services/StudentService";

const StudentProgress = () => {

    const navigate = useNavigate();
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const loadStudent = async () => {

        try {
            setLoading(true);
            const response = await StudentService.getStudent(studentId);
            setStudent(response.data.student);
        } catch (error) {
            toast.error("Unable to load student record.");
            navigate("/student-records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudent();
    }, [studentId]);

    const handleGeneratePDF = () => {
        toast("PDF Report generation will be available soon.");
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <Loader />;
    }
    if (!student) {

        return (

            <DashboardLayout>
                <DashboardHeader />

                <PageContainer>
                    <BackButton to="/student-records" />
                    <div
                        className="
                            bg-white
                            rounded-3xl
                            shadow-lg
                            p-20
                            text-center
                        "
                    >
                        <div className="text-7xl mb-6">
                            📄
                        </div>
                        <h2
                            className="
                                text-3xl
                                font-bold
                                text-slate-800
                            "
                        >
                            Student Not Found
                        </h2>
                        <p
                            className="
                                mt-4
                                text-slate-500
                            "
                        >
                            The selected student record could not be found.
                        </p>
                    </div>
                </PageContainer>
            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>
            <DashboardHeader />

            <PageContainer>
                <BackButton
                    className="mb-6"
                    to="/student-records"
                    label="Back to Student Records"
                />
                <StudentProfileHeader
                    student={student}
                />
                <ProgressSummaryCards
                    student={student}
                />
                <AssessmentOverview
                    student={student}
                />
                <RecentSessionsTable
                    sessions={[]}
                />
                <GenerateReportCard
                    student={student}
                    onGeneratePDF={handleGeneratePDF}
                    onPrint={handlePrint}
                />
            </PageContainer>
        </DashboardLayout>
    );
};

export default StudentProgress;