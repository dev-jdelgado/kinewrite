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
import Star from '../assets/login/star.png';
import Star1 from '../assets/login/star1.png';

const TherapistDashboard = () => {

    const navigate = useNavigate();

    return (

        <DashboardLayout>

            <DashboardHeader
                onSettings={() => navigate("/settings")}
            />

            <PageContainer>

                <div className="grid justify-items-center lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-16 lg:gap-10 sm:gap-12 gap-10 lg:px-10 md:px-20 sm:px-5 px-4">

                    <DashboardCard
                        title="Student Management"
                        image={managementBG}
                        icon={managementIcon}
                        onClick={() => navigate("/students")}
                    />

                    <DashboardCard
                        title="Student Records"
                        image={recordsBG}
                        icon={recordsIcon}
                        onClick={() => navigate("/student-records")}
                    />

                    <DashboardCard
                        title="Start Exercises"
                        image={exerciseBG}
                        icon={exerciseIcon}
                        onClick={() =>
                            navigate("/student-selection?mode=exercise")
                        }
                    />
                    <img src={Star} alt="Sun" className="hidden lg:block absolute w-20 top-40 right-0 animate-spin-slow"/>
                    <img src={Star1} alt="Sun" className="hidden lg:block absolute w-20 bottom-20 left-1 animate-spin-slow"/>
                </div>              
            </PageContainer>

        </DashboardLayout>

    );

};

export default TherapistDashboard;