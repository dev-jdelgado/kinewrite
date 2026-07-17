import DashboardLayout from "../layouts/DashboardLayout";
import PageContainer from "../components/common/PageContainer";
import BackButton from "../components/common/BackButton";

import ProfileSection from "../components/settings/ProfileSection";
import Preferences from "../components/settings/Preferences";
import ChangePassword from "../components/settings/ChangePassword";
import LogoutButton from "../components/settings/LogoutButton";

import logo from "../assets/logo.png";

export default function Settings() {
    return (
        <DashboardLayout>
            <PageContainer>

                {/* Back Button */}
                <div className="absolute top-8 left-8 z-40">
                    <BackButton />
                </div>

                {/* Logo */}
                <div className="absolute top-5 right-10 z-20">
                    <img
                        src={logo}
                        alt="KineWrite"
                        className="md:w-45 w-32"
                    />
                </div>

                {/* Settings Card */}
                <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8 mt-20">

                    <div className="grid md:grid-cols-2 gap-10">

                        {/* Left Side */}
                        <ProfileSection />

                        {/* Right Side */}
                        <div>
                            <Preferences />
                            <ChangePassword />
                            <LogoutButton />
                        </div>

                    </div>

                </div>

            </PageContainer>
        </DashboardLayout>
    );
}