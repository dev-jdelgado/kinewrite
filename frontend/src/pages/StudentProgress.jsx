import { useEffect, useMemo, useState } from "react";
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
import ExerciseService from "../services/ExerciseService";

const StudentProgress = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();

    const [student, setStudent] = useState(null);
    const [exerciseData, setExerciseData] = useState({
        sessions: [],
        attempts: [],
    });
    const [loading, setLoading] = useState(true);

    const loadStudent = async () => {
        try {
            setLoading(true);

            const [studentResponse, exerciseResponse] = await Promise.all([
                StudentService.getStudent(studentId),
                ExerciseService.getStudentHistory(studentId),
            ]);

            setStudent(studentResponse?.data?.student || null);
            setExerciseData(
                exerciseResponse?.data || {
                    sessions: [],
                    attempts: [],
                }
            );
        } catch (error) {
            console.error("Student progress load error:", error);
            toast.error("Unable to load student record.");
            navigate("/student-records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudent();
    }, [studentId]);

    const progressStudent = useMemo(() => {
        if (!student) return null;

        const attempts = exerciseData.attempts || [];

        // One activity contains multiple item attempts. Count the
        // activity once instead of treating every item as an activity.
        const completedActivityIds = new Set();

        attempts.forEach((attempt) => {
            let meta = {};

            try {
                meta =
                    typeof attempt.stroke_data === "string"
                        ? JSON.parse(attempt.stroke_data)
                        : attempt.stroke_data || {};
            } catch {
                meta = {};
            }

            const activityId =
                meta.activityId ||
                meta.activity_id ||
                attempt.exercise_id;

            if (activityId) {
                completedActivityIds.add(String(activityId));
            }
        });

        const completedExercises =
            completedActivityIds.size;

        const totalStars = attempts.reduce(
            (sum, attempt) => sum + Number(attempt.stars || 0),
            0
        );

        return {
            ...student,
            completed_exercises: completedExercises,
            total_stars: totalStars,
        };
    }, [student, exerciseData.attempts]);

    const handleGeneratePDF = () => {
        navigate(`/student-records/${studentId}/report`);
    };

    const handlePrint = () => {
        navigate(`/student-records/${studentId}/report`);
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
                    <div className="bg-white rounded-3xl shadow-lg p-20 text-center">
                        <div className="text-7xl mb-6">📄</div>
                        <h2 className="text-3xl font-bold text-slate-800">
                            Student Not Found
                        </h2>
                        <p className="mt-4 text-slate-500">
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

                <StudentProfileHeader student={student} />

                <ProgressSummaryCards student={progressStudent} />

                <AssessmentOverview student={student} />

                <RecentSessionsTable
                    sessions={exerciseData.sessions || []}
                    onViewSession={(session) =>
                        navigate(
                            `/student-records/${studentId}/report?session=${session.session_id}`
                        )
                    }
                />

                <GenerateReportCard
                    student={progressStudent}
                    onGeneratePDF={handleGeneratePDF}
                    onPrint={handlePrint}
                />
            </PageContainer>
        </DashboardLayout>
    );
};

export default StudentProgress;
