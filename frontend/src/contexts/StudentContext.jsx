import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback
} from "react";
import toast from "react-hot-toast";

import StudentService from "../services/StudentService";
import { useAuth } from "./AuthContext";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {

    const { admin, token } = useAuth();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==============================
    // Load Students
    // ==============================

    const fetchStudents = useCallback(async () => {

        if (!token || !admin?.school_id) {
            setStudents([]);
            setLoading(false);
            return;
        }

        try {

            setLoading(true);

            const response = await StudentService.getStudents();

            setStudents(response.data.students || []);

        } catch (error) {

            console.error("Fetch Students Error:", error);

            setStudents([]);

            toast.error(
                error.response?.data?.message ||
                "Unable to load students."
            );

        } finally {

            setLoading(false);

        }

    }, [token, admin?.school_id]);

    // ==============================
    // Create Student
    // ==============================

    const createStudent = async (student) => {
        try {
            const response = await StudentService.createStudent(student);
            toast.success(response.message);
            await fetchStudents();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to create student."
            );
            return false;
        }
    };

    // ==============================
    // Update Student
    // ==============================

    const updateStudent = async (id, student) => {
        try {
            const response = await StudentService.updateStudent(
                id,
                student
            );
            toast.success(response.message);
            await fetchStudents();

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to update student."
            );
            return false;
        }
    };

    // ==============================
    // Archive Student
    // ==============================

    const archiveStudent = async (id) => {
        try {
            const response = await StudentService.archiveStudent(id);
            toast.success(response.message);

            await fetchStudents();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to archive student."
            );
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    return (
        <StudentContext.Provider
            value={{
                students,
                loading,
                fetchStudents,
                createStudent,
                updateStudent,
                archiveStudent,
            }}
        >
            {children}
        </StudentContext.Provider>
    );
};

export const useStudents = () => useContext(StudentContext);