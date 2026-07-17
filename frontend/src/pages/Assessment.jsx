import {
    useEffect,
} from "react";

import {
    useParams,
    useSearchParams,
} from "react-router-dom";

import StudentService from "../services/StudentService";
import AssessmentService from "../services/AssessmentService";

import AssessmentLayout from "../components/assessment/utils/AssessmentLayout";
import AssessmentRouter from "../components/assessment/utils/AssessmentRouter";

import {

    AssessmentProvider,

    useAssessment,

} from "../components/assessment/utils/AssessmentContext";

import preAssessmentActivities from "../components/assessment/data/preAssessmentActivities";
import postAssessmentActivities from "../components/assessment/data/postAssessmentActivities";

const AssessmentContent = () => {

    const {

        studentId,

    } = useParams();

    const [

        searchParams,

    ] = useSearchParams();

    const {

        setStudent,

        setAssessmentId,

        setAssessmentType,

        setActivities,

        setLoading,

        resetAssessment,

    } = useAssessment();

    useEffect(() => {

        const initializeAssessment = async () => {

            try {

                setLoading(true);

                // =====================================
                // Assessment Type
                // =====================================

                const type =

                    searchParams.get("type") ||

                    "pre";

                setAssessmentType(type);

                // =====================================
                // Activities
                // =====================================

                if (type === "pre") {

                    setActivities(

                        preAssessmentActivities

                    );

                }

                else {

                    setActivities(

                        postAssessmentActivities

                    );

                }

                // =====================================
                // Student
                // =====================================

                const studentResponse =

                    await StudentService.getStudent(

                        studentId

                    );

                if (

                    studentResponse.success

                ) {

                    setStudent(

                        studentResponse.data.student

                    );

                }

                // =====================================
                // Start Assessment
                // =====================================

                const assessmentResponse =

                    await AssessmentService.startAssessment({

                        studentId,

                        assessmentType:

                            type,

                    });

                if (

                    assessmentResponse.success

                ) {

                    setAssessmentId(

                        assessmentResponse

                            .data

                            .assessmentId

                    );

                }

            }

            catch (error) {

                console.error(

                    "Assessment Initialization Failed",

                    error

                );

            }

            finally {

                setLoading(false);

            }

        };

        initializeAssessment();

        return () => {

            resetAssessment();

        };

    }, [

        studentId,

        searchParams,

    ]);

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