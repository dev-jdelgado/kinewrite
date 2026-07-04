import React from "react";
import { useNavigate } from "react-router-dom";

import PageContainer from "../components/common/PageContainer";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardCard from "../components/dashboard/DashboardCard";

import managementBG from "../assets/dashboard/student-management.jpg";
import recordsBG from "../assets/dashboard/student-records.jpg";
import exerciseBG from "../assets/dashboard/start-exercises.jpg";

import managementIcon from "../assets/icons/student-management.png";
import recordsIcon from "../assets/icons/student-records.png";
import exerciseIcon from "../assets/icons/start-exercise.png";

const TherapistDashboard = () => {
    const navigate = useNavigate();

    return (
        <DashboardLayout>

            <DashboardHeader
                onSettings={() => navigate("/settings")}
            />

            <PageContainer>

                <div className="grid grid-cols-3 gap-16">

                    <DashboardCard
                        title="Student Management"
                        image={managementBG}
                        icon={managementIcon}
                        onClick={() =>
                            navigate("/students")
                        }
                    />

                    <DashboardCard
                        title="Student Progress"
                        image={recordsBG}
                        icon={recordsIcon}
                        onClick={() =>
                            navigate("/progress")
                        }
                    />

                    <DashboardCard
                        title="Start Exercises"
                        image={exerciseBG}
                        icon={exerciseIcon}
                        onClick={() =>
                            navigate("/exercise")
                        }
                    />

                </div>

            </PageContainer>

        </DashboardLayout>
    );
};

export default TherapistDashboard;