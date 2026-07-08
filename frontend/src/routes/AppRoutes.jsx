import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import TherapistDashboard from "../pages/TherapistDashboard";
import StudentManagement from "../pages/StudentManagement";
import StudentSelection from "../pages/StudentSelection";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Login */}
            <Route
                path="/"
                element={<Login />}
            />

            {/* Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <TherapistDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Student Management */}
            <Route
                path="/students"
                element={
                    <ProtectedRoute>
                        <StudentManagement />
                    </ProtectedRoute>
                }
            />

            
            {/* Start Exercises */}
            <Route
                path="/exercise"
                element={
                    <ProtectedRoute>
                        <StudentSelection />
                    </ProtectedRoute>
                }
            />

            {/* Temporary */}
            <Route
                path="*"
                element={<Navigate to="/" />}
            />
        </Routes>
    );
};

export default AppRoutes;