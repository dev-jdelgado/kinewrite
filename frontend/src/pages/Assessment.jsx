import {
    useEffect,
} from "react";

import {
    useParams,
    useSearchParams,
} from "react-router-dom";

import StudentService from "./services/StudentService";
import AssessmentService from "./services/AssessmentService";

import AssessmentLayout from "./components/assessment/utils/AssessmentLayout";
import AssessmentRouter from "./components/assessment/utils/AssessmentRouter";

import {
    AssessmentProvider,
    useAssessment,
} from "./components/assessment/utils/AssessmentContext";

import preAssessmentActivities from "./components/assessment/data/preAssessmentActivities";
import postAssessmentActivities from "./components/assessment/data/postAssessmentActivities";


const AssessmentContent = () => {

    const {
        studentId,
    } = useParams();


    const [
        searchParams,
    ] = useSearchParams();


    const {
        assessmentId,
        setStudent,
        setAssessmentId,
        setAssessmentType,
        setActivities,
        setLoading,
        setError,
        resetAssessment,
        loading,
        error,
    } = useAssessment();


    useEffect(() => {

        let cancelled = false;


        const initializeAssessment = async () => {

            try {

                setLoading(true);

                setError(null);


                // ==========================================
                // Validate Student ID
                // ==========================================

                if (
                    !studentId ||
                    studentId === "null" ||
                    studentId === "undefined"
                ) {

                    throw new Error(
                        "Invalid student ID."
                    );

                }


                // ==========================================
                // Assessment Type
                // ==========================================

                const requestedType =
                    searchParams.get("type") || "pre";


                const assessmentType =
                    requestedType === "post"
                        ? "Post-Test"
                        : "Pre-Test";


                setAssessmentType(
                    assessmentType
                );


                // ==========================================
                // Activities
                // ==========================================

                if (
                    requestedType === "post"
                ) {

                    setActivities(
                        postAssessmentActivities
                    );

                } else {

                    setActivities(
                        preAssessmentActivities
                    );

                }


                // ==========================================
                // Load Student
                // ==========================================

                const studentResponse =
                    await StudentService.getStudent(
                        studentId
                    );


                if (
                    cancelled
                ) {

                    return;

                }


                if (
                    !studentResponse ||
                    !studentResponse.success
                ) {

                    throw new Error(
                        studentResponse?.message ||
                        "Unable to load student."
                    );

                }


                setStudent(
                    studentResponse.data.student
                );


                // ==========================================
                // Start Assessment
                // ==========================================

                console.log(
                    "Starting assessment:",
                    {
                        studentId,
                        assessmentType,
                    }
                );


                const assessmentResponse =
                    await AssessmentService.startAssessment({

                        studentId,

                        assessmentType,

                    });


                if (
                    cancelled
                ) {

                    return;

                }


                console.log(
                    "Start Assessment Response:",
                    assessmentResponse
                );


                if (
                    !assessmentResponse ||
                    !assessmentResponse.success
                ) {

                    throw new Error(
                        assessmentResponse?.message ||
                        "Failed to start assessment."
                    );

                }


                // ==========================================
                // Get Assessment ID
                // ==========================================

                const returnedAssessmentId =
                    assessmentResponse?.data?.assessmentId;


                const numericAssessmentId =
                    Number(
                        returnedAssessmentId
                    );


                // ==========================================
                // CRITICAL VALIDATION
                // ==========================================

                if (
                    !Number.isInteger(
                        numericAssessmentId
                    ) ||
                    numericAssessmentId <= 0
                ) {

                    console.error(
                        "Invalid assessment ID returned:",
                        returnedAssessmentId,
                        assessmentResponse
                    );


                    throw new Error(
                        "The server did not return a valid assessment ID."
                    );

                }


                console.log(
                    "Assessment created successfully:",
                    numericAssessmentId
                );


                // ==========================================
                // Store Valid Assessment ID
                // ==========================================

                setAssessmentId(
                    numericAssessmentId
                );


            } catch (error) {

                console.error(
                    "Assessment Initialization Failed:",
                    error
                );


                if (
                    !cancelled
                ) {

                    setError(
                        error.message ||
                        "Failed to initialize assessment."
                    );

                }

            } finally {

                if (
                    !cancelled
                ) {

                    setLoading(false);

                }

            }

        };


        initializeAssessment();


        return () => {

            cancelled = true;

        };


    }, [
        studentId,
        searchParams,
    ]);


    // ==========================================
    // Error
    // ==========================================

    if (
        error
    ) {

        return (

            <div
                className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    bg-white
                    px-6
                "
            >

                <div
                    className="
                        max-w-md
                        text-center
                    "
                >

                    <div
                        className="
                            text-5xl
                            mb-4
                        "
                    >
                        ⚠️
                    </div>


                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-red-500
                        "
                    >
                        Unable to Start Assessment
                    </h2>


                    <p
                        className="
                            mt-3
                            text-gray-600
                        "
                    >
                        {error}
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // Wait for Assessment ID
    // ==========================================

    if (
        loading ||
        !assessmentId
    ) {

        return (

            <div
                className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    bg-white
                    px-6
                "
            >

                <div
                    className="
                        text-center
                    "
                >

                    <div
                        className="
                            text-5xl
                            mb-5
                        "
                    >
                        ✏️
                    </div>


                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-sky-600
                        "
                    >
                        Preparing Assessment...
                    </h2>


                    <p
                        className="
                            mt-3
                            text-gray-500
                        "
                    >
                        Please wait while your handwriting assessment is prepared.
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // Assessment Ready
    // ==========================================

    return (

        <AssessmentLayout>

            <AssessmentRouter />

        </AssessmentLayout>

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