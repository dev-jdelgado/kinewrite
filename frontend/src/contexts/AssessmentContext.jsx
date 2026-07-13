import {
    createContext,
    useContext,
    useMemo,
    useState,
} from "react";

const AssessmentContext = createContext();

export const AssessmentProvider = ({ children }) => {

    // =============================================
    // Assessment Navigation
    // =============================================
    const totalSteps = 6;

    const [currentStep, setCurrentStep] =
        useState(1);

    // =============================================
    // Student
    // =============================================
    const [student, setStudent] =
        useState(null);

    // =============================================
    // Handwriting Capture
    // =============================================
    const [handwritingData, setHandwritingData] =
        useState([]);

    const [handwritingImage, setHandwritingImage] =
        useState(null);

    // =============================================
    // Complete Assessment Result
    // =============================================
    const [assessmentResult, setAssessmentResult] =
        useState(null);

    // =============================================
    // Therapist Remarks
    // =============================================
    const [therapistRemarks, setTherapistRemarks] =
        useState("");

    // =============================================
    // Loading & Error
    // =============================================
    const [analysisLoading, setAnalysisLoading] =
        useState(false);

    const [analysisError, setAnalysisError] =
        useState(null);

    // =============================================
    // Navigation
    // =============================================
    const nextStep = () => {
        setCurrentStep((previous) =>
            Math.min(previous + 1, totalSteps)
        );
    };

    const previousStep = () => {
        setCurrentStep((previous) =>
            Math.max(previous - 1, 1)
        );
    };

    const goToStep = (step) => {
        if (
            step >= 1 &&
            step <= totalSteps
        ) {
            setCurrentStep(step);
        }
    };

    // =============================================
    // Reset Assessment
    // =============================================
    const resetAssessment = () => {
        setCurrentStep(1);
        setStudent(null);
        setHandwritingData([]);
        setHandwritingImage(null);
        setAssessmentResult(null);
        setTherapistRemarks("");
        setAnalysisLoading(false);
        setAnalysisError(null);
    };

    // =============================================
    // Context Value
    // =============================================
    const value = useMemo(() => ({

        // Navigation
        currentStep,
        totalSteps,

        nextStep,
        previousStep,
        goToStep,

        // Student
        student,
        setStudent,

        // Handwriting
        handwritingData,
        setHandwritingData,
        handwritingImage,
        setHandwritingImage,

        // Assessment
        assessmentResult,
        setAssessmentResult,

        // Therapist
        therapistRemarks,
        setTherapistRemarks,

        // Loading
        analysisLoading,
        setAnalysisLoading,

        analysisError,
        setAnalysisError,

        // Reset
        resetAssessment,

    }), [
        currentStep,
        student,
        handwritingData,
        handwritingImage,
        assessmentResult,
        therapistRemarks,
        analysisLoading,
        analysisError,
    ]);

    return (
        <AssessmentContext.Provider value={value}>
            {children}
        </AssessmentContext.Provider>
    );
};

export const useAssessment = () =>
    useContext(AssessmentContext);