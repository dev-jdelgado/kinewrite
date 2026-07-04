import api from "../api/axios";

const getStudents = async () => {
    const response = await api.get("/students");
    return response.data;
};

const getStudent = async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
};

const createStudent = async (student) => {
    const response = await api.post("/students", student);
    return response.data;
};

const updateStudent = async (id, student) => {
    const response = await api.put(`/students/${id}`, student);
    return response.data;
};

const archiveStudent = async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
};

const StudentService = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    archiveStudent,
};

export default StudentService;