import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import TherapistDashboard from "../pages/TherapistDashboard";
import StudentManagement from "../pages/StudentManagement";
import StudentSelection from "../pages/StudentSelection";
import StudentRecords from "../pages/StudentRecords";
import Settings from "../pages/Settings"

import StudentProgress from "../pages/StudentProgress";

import Assessment from "../pages/Assessment";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>

            {/* Login */}
            <Route
                path="/"
                element={<Login />}
            />

            {/* Therapist Dashboard */}
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

            
            {/* Account Settings */}
            <Route
                path="/account-settings"
                element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                }
            />

            {/* Student Records */}
            <Route
                path="/student-records"
                element={
                    <ProtectedRoute>
                        <StudentRecords />
                    </ProtectedRoute>
                }
            />

            {/* Student Progress */}
            <Route
                path="/student-records/:studentId"
                element={
                    <ProtectedRoute>
                        <StudentProgress />
                    </ProtectedRoute>
                }
            />

            {/* Student Selection (Exercise Only) */}
            <Route
                path="/student-selection"
                element={
                    <ProtectedRoute>
                        <StudentSelection />
                    </ProtectedRoute>
                }
            />

            {/* Exercise Session */}
            <Route
                path="/exercise/:studentId"
                element={
                    <ProtectedRoute>
                        <div className="flex items-center justify-center min-h-screen text-4xl font-bold">
                            Exercise Session Page
                        </div>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/assessment/:studentId"
                element={
                    <ProtectedRoute>
                        <Assessment />
                    </ProtectedRoute>
                }
            />

            {/* Unknown Routes */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
};

export default AppRoutes;