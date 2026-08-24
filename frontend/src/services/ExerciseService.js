import api from "../api/axios";
const ExerciseService = {
    async startSession(studentId) { const response = await api.post("/exercises/session/start", { studentId }); return response.data; },
    async saveAttempt(payload) { const response = await api.post("/exercises/attempt", payload); return response.data; },
    async completeSession(sessionId) { const response = await api.post(`/exercises/session/${sessionId}/complete`); return response.data; },
    async getSession(sessionId) { const response = await api.get(`/exercises/session/${sessionId}`); return response.data; },
    async getStudentHistory(studentId) { const response = await api.get(`/exercises/student/${studentId}/history`); return response.data; },
};
export default ExerciseService;
