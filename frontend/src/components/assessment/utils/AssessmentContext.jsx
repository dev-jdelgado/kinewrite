import {
    createContext,
    useContext,
    useMemo,
    useState,
} from "react";

const AssessmentContext =
    createContext();

export const AssessmentProvider = ({

    children,

}) => {

    // ==========================================
    // Student
    // ==========================================

    const [

        student,

        setStudent,

    ] = useState(null);

    // ==========================================
    // Assessment
    // ==========================================

    const [

        assessmentId,

        setAssessmentId,

    ] = useState(null);

    const [

        assessmentType,

        setAssessmentType,

    ] = useState("Pre-Test");

    // ==========================================
    // Workflow
    // ==========================================

    const [

        currentPage,

        setCurrentPage,

    ] = useState("instructions");

    const goToPage = page =>

        setCurrentPage(page);

    // ==========================================
    // Activities
    // ==========================================

    const [

        activities,

        setActivities,

    ] = useState([]);

    const [

        currentActivityIndex,

        setCurrentActivityIndex,

    ] = useState(0);

    const currentActivity =

        activities[currentActivityIndex] ||

        null;

    const nextActivity = () =>

        setCurrentActivityIndex(previous =>

            Math.min(

                previous + 1,

                activities.length - 1

            )

        );

    const previousActivity = () =>

        setCurrentActivityIndex(previous =>

            Math.max(

                previous - 1,

                0

            )

        );

    // ==========================================
    // Analysis
    // ==========================================

    const [

        analysis,

        setAnalysis,

    ] = useState(null);

    // ==========================================
    // Handwriting
    // ==========================================

    const [

        handwritingData,

        setHandwritingData,

    ] = useState([]);

    const [

        handwritingImage,

        setHandwritingImage,

    ] = useState(null);

    // ==========================================
    // Therapist Remarks
    // ==========================================

    const [

        remarks,

        setRemarks,

    ] = useState("");

    // ==========================================
    // Exercise Plan
    // ==========================================

    const [

        exercisePlan,

        setExercisePlan,

    ] = useState(null);

    // ==========================================
    // Loading
    // ==========================================

    const [

        loading,

        setLoading,

    ] = useState(false);

    const [

        error,

        setError,

    ] = useState(null);

    // ==========================================
    // Reset
    // ==========================================

    const resetAssessment = () => {

        setAssessmentId(null);

        setStudent(null);

        setCurrentPage("instructions");

        setActivities([]);

        setCurrentActivityIndex(0);

        setAnalysis(null);

        setRemarks("");

        setExercisePlan(null);

        setLoading(false);

        setError(null);

    };

    // ==========================================
    // Context Value
    // ==========================================

    const value = useMemo(() => ({

        // Student

        student,
        setStudent,

        // Assessment

        assessmentId,
        setAssessmentId,

        assessmentType,
        setAssessmentType,

        // Workflow

        currentPage,
        goToPage,

        // Activities

        activities,
        setActivities,

        currentActivity,

        currentActivityIndex,

        nextActivity,

        previousActivity,

        // Analysis

        analysis,
        setAnalysis,

        // Handwriting

        handwritingData,
        setHandwritingData,

        handwritingImage,
        setHandwritingImage,

        // Therapist

        remarks,
        setRemarks,

        // Exercise Plan

        exercisePlan,
        setExercisePlan,

        // Loading

        loading,
        setLoading,

        error,
        setError,

        // Reset

        resetAssessment,

    }), [

        student,
    
        assessmentId,
    
        assessmentType,
    
        currentPage,
    
        activities,
    
        currentActivity,
    
        currentActivityIndex,
    
        analysis,
    
        handwritingData,
    
        handwritingImage,
    
        remarks,
    
        exercisePlan,
    
        loading,
    
        error,
    
    ]);

    return (

        <AssessmentContext.Provider

            value={value}

        >

            {children}

        </AssessmentContext.Provider>

    );

};

export const useAssessment = () =>

    useContext(

        AssessmentContext

    );