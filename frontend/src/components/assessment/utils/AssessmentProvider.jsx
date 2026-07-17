import { useEffect } from "react";
import {
    useParams,
    useSearchParams,
} from "react-router-dom";

import AssessmentLayout from "./AssessmentLayout";
import AssessmentRouter from "./AssessmentRouter";

import {
    AssessmentProvider,
    useAssessment,
} from "./AssessmentContext";

import StudentService from "../../../services/StudentService";

const AssessmentContent = () => {

    const { studentId } = useParams();

    const [searchParams] =
        useSearchParams();

    const {

        setAssessmentType,

        setStudent,

        resetAssessment,

    } = useAssessment();

    useEffect(() => {

        const loadStudent = async () => {

            try {

                const response =
                    await StudentService.getStudent(
                        studentId
                    );

                if (response.success) {

                    setStudent(
                        response.data.student
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to load student.",
                    error
                );

            }

        };

        const type =
            searchParams.get("type") ||
            "pre";

        setAssessmentType(type);

        loadStudent();

        return () => {

            resetAssessment();

        };

    }, [
        studentId,
        searchParams,
        setAssessmentType,
        setStudent,
        resetAssessment,
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