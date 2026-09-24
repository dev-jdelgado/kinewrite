import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ClipboardPenLine } from "lucide-react";

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

            const [
                studentResponse,
                exerciseResponse,
            ] = await Promise.all([

                StudentService.getStudent(
                    studentId
                ),

                ExerciseService.getStudentHistory(
                    studentId
                ),

            ]);


            setStudent(
                studentResponse?.data?.student || null
            );


            setExerciseData(
                exerciseResponse?.data || {
                    sessions: [],
                    attempts: [],
                }
            );
        } catch (error) {

            console.error(
                "Student progress load error:",
                error
            );

            toast.error(
                "Unable to load student record."
            );

            navigate(
                "/student-records"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudent();
    }, [studentId]);

    const progressStudent = useMemo(() => {

        if (!student) {
            return null;
        }

        const attempts =
            exerciseData.attempts || [];

        // One activity contains multiple
        // item attempts. Count the activity once
        // instead of treating every item as an activity.

        const completedActivityIds =
            new Set();


        attempts.forEach((attempt) => {
            let meta = {};

            try {
                meta =
                    typeof attempt.stroke_data === "string"
                        ? JSON.parse(
                            attempt.stroke_data
                        )
                        : attempt.stroke_data || {};
            } catch {
                meta = {};
            }

            const activityId =
                meta.activityId ||
                meta.activity_id ||
                attempt.exercise_id;

            if (activityId) {
                completedActivityIds.add(
                    String(activityId)
                );
            }
        });

        const completedExercises =
            completedActivityIds.size;

        const totalStars =
            attempts.reduce(
                (sum, attempt) =>
                    sum +
                    Number(
                        attempt.stars || 0
                    ),
                0
            );

        return {
            ...student,
            completed_exercises:
                completedExercises,

            total_stars:
                totalStars,
        };
    }, [
        student,
        exerciseData.attempts,
    ]);


    // ==========================================
    // Report
    // ==========================================

    const handleGeneratePDF = () => {
        navigate(
            `/student-records/${studentId}/report`
        );
    };

    const handlePrint = () => {
        navigate(
            `/student-records/${studentId}/report`
        );
    };

    if (loading) {
        return <Loader />;
    }

    if (!student) {
        return (
            <DashboardLayout>
                <DashboardHeader />
                <PageContainer>
                    <BackButton
                        to="/student-records"
                    />
                    <div
                        className="
                            bg-white
                            rounded-3xl
                            shadow-lg
                            p-20
                            text-center
                        "
                    >
                        <div
                            className="
                                text-7xl
                                mb-6
                            "
                        >
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
                            The selected student record
                            could not be found.
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
                    student={progressStudent}
                />

                <AssessmentOverview
                    student={student}
                />

                <RecentSessionsTable
                    sessions={
                        exerciseData.sessions || []
                    }

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

                <div
                    className="
                        mt-6
                        bg-white
                        rounded-3xl
                        shadow-lg
                        p-6
                        md:p-8
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-6
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-5
                        "
                    >
                        <div
                            className="
                                w-16
                                h-16
                                rounded-2xl
                                bg-sky-100
                                flex
                                items-center
                                justify-center
                                shrink-0
                            "
                        >
                            <ClipboardPenLine
                                size={32}
                                className="
                                    text-sky-600
                                "
                            />
                        </div>

                        <div>
                            <h2
                                className="
                                    text-xl
                                    md:text-2xl
                                    font-black
                                    text-slate-800
                                "
                            >
                                Take-Home Activity
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-slate-500
                                "
                            >
                                Print a handwriting
                                practice worksheet
                                for{" "}
                                {student.student_fname}.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                `/take-home/${studentId}`
                            )
                        }
                        className="
                            w-full
                            md:w-auto
                            px-6
                            py-3
                            rounded-2xl
                            bg-sky-500
                            hover:bg-sky-600
                            text-white
                            font-black
                            shadow-lg
                            transition
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >
                        <ClipboardPenLine
                            size={20}
                        />
                        Open Take-Home Activity
                    </button>
                </div>
            </PageContainer>
        </DashboardLayout>
    );
};

export default StudentProgress;