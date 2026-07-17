import api from "../api/axios";

const AssessmentService = {

    // ==========================================
    // Start Assessment
    // ==========================================

    async startAssessment({

        studentId,

        assessmentType,

    }) {

        const response =
            await api.post(

                "/assessments/start",

                {

                    studentId,

                    assessmentType,

                }

            );

        return response.data;

    },

    // ==========================================
    // Save Activity
    // ==========================================

    async saveActivity(

        assessmentId,

        activity

    ) {

        const response =
            await api.post(

                `/assessments/${assessmentId}/activity`,

                activity

            );

        return response.data;

    },

    // ==========================================
    // Analyze Assessment
    // ==========================================

    async analyzeAssessment(

        assessmentId

    ) {

        const response =
            await api.post(

                `/assessments/${assessmentId}/analyze`

            );

        return response.data;

    },

    // ==========================================
    // Get Assessment
    // ==========================================

    async getAssessment(

        assessmentId

    ) {

        const response =
            await api.get(

                `/assessments/${assessmentId}`

            );

        return response.data;

    },

    // ==========================================
    // Student Assessment History
    // ==========================================

    async getStudentAssessments(

        studentId

    ) {

        const response =
            await api.get(

                `/assessments/student/${studentId}`

            );

        return response.data;

    },

};

export default AssessmentService;