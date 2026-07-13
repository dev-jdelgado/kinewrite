import { useEffect } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import PageContainer from "../components/common/PageContainer";
import BackButton from "../components/common/BackButton";

import AssessmentHeader from "../components/assessment/AssessmentHeader";
import AssessmentStepper from "../components/assessment/AssessmentStepper";

import AssessmentIntro from "../components/assessment/AssessmentIntro";
import AssessmentInstructions from "../components/assessment/AssessmentInstructions";
import WritingActivity from "../components/assessment/WritingActivity.jsx";
import SystemAnalysis from "../components/assessment/SystemAnalysis";
import AssessmentResults from "../components/assessment/AssessmentResults";
import AssessmentRemarks from "../components/assessment/AssessmentRemarks";
import AssessmentFooter from "../components/assessment/AssessmentFooter";

import {
    AssessmentProvider,
    useAssessment,
} from "../contexts/AssessmentContext";

const AssessmentContent = () => {

    const { studentId } = useParams();

    const {
        currentStep,
        loadStudent,
        clearStudent,
    } = useAssessment();

    useEffect(() => {

        if (studentId) {
            loadStudent(studentId);
        }

        return () => {
            clearStudent();
        };
    }, [studentId]);

    const renderStep = () => {

        switch (currentStep) {

            case 1:
                return <AssessmentIntro />;
            case 2:
                return <AssessmentInstructions />;
            case 3:
                return <WritingActivity />;
            case 4:
                return <SystemAnalysis />;
            case 5:
                return <AssessmentResults />;
            case 6:
                return <AssessmentRemarks />;
        
            default:
                return null;
        }
    };

    return (

        <DashboardLayout>
            <DashboardHeader />
            <PageContainer>

                <BackButton
                    to={`/student-records/${studentId}`}
                    label="Back to Student Profile"
                />

                <AssessmentHeader />
                <AssessmentStepper />

                <div
                    className="
                        mt-8
                        rounded-3xl
                        bg-white
                        shadow-lg
                        p-8
                    "
                >
                    {renderStep()}
                </div>

                <AssessmentFooter />
            </PageContainer>
        </DashboardLayout>
    );
};

const Assessment = () => {

    return (

        <AssessmentProvider>
            <AssessmentContent />
        </AssessmentProvider>

    );
};

export default Assessment;