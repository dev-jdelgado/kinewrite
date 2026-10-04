import api from "../api/axios";

const StudentService = {
    async getStudents() {
        const response = await api.get("/students");
        return response.data;
    },

    async getArchivedStudents() {
        const response = await api.get("/students/archived");
        return response.data;
    },

    async getStudent(id) {
        const response = await api.get(`/students/${id}`);
        return response.data;
    },

    async createStudent(student) {
        const response = await api.post("/students", student);
        return response.data;
    },

    async updateStudent(id, student) {
        const response = await api.put(`/students/${id}`, student);
        return response.data;
    },

    async archiveStudent(id) {
        const response = await api.delete(`/students/${id}`);
        return response.data;
    },

    async restoreStudent(id) {
        const response = await api.put(`/students/${id}/restore`);
        return response.data;
    },
};

export default StudentService;
