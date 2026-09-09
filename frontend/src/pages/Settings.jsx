import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import PageContainer from "../components/common/PageContainer";
import BackButton from "../components/common/BackButton";

import ProfileSection from "../components/settings/ProfileSection";
import Preferences from "../components/settings/Preferences";
import ChangePassword from "../components/settings/ChangePassword";
import LogoutButton from "../components/settings/LogoutButton";
import About from "../components/settings/About";
import Terms from "../components/settings/Terms";
import UserGuide from "../components/settings/UserGuide";

import logo from "../assets/logo.png";

export default function Settings() {

    const [activeTab, setActiveTab] = useState("account");

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
                <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl sm:p-8 p-5 mt-20">

                    {/* Tabs */}
                    <div
                        role="tablist"
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-10"
                    >
                        <button
                            role="tab"
                            className={`flex items-center justify-center gap-2
                                px-5 py-3 rounded-xl font-semibold
                                transition-all duration-200
                                ${activeTab === "account"
                                    ? "bg-[#3B9BEF] text-white shadow-md scale-[1.02]"
                                    : "text-slate-600 hover:bg-white hover:text-[#3B9BEF]"
                                }
                            `}
                            onClick={() => setActiveTab("account")}
                        >
                            👤
                            <span>Account</span>
                        </button>

                        <button
                            role="tab"
                            className={`flex items-center justify-center gap-2
                                px-5 py-3 rounded-xl font-semibold
                                transition-all duration-200
                                ${activeTab === "general"
                                    ? "bg-[#3B9BEF] text-white shadow-md scale-[1.02]"
                                    : "text-slate-600 hover:bg-white hover:text-[#3B9BEF]"
                                }
                            `}
                            onClick={() => setActiveTab("general")}
                        >⚙️
                            <span>General</span>
                        </button>

                        <button
                            role="tab"
                            className={`flex items-center justify-center gap-2
                                px-5 py-3 rounded-xl font-semibold
                                transition-all duration-200
                                ${activeTab === "guide"
                                    ? "bg-[#3B9BEF] text-white shadow-md scale-[1.02]"
                                    : "text-slate-600 hover:bg-white hover:text-[#3B9BEF]"
                                }
                            `}
                            onClick={() => setActiveTab("guide")}
                        >
                            📖
                            <span>User Guide</span>
                        </button>

                        <button
                            role="tab"
                            className={`flex items-center justify-center gap-2
                                px-5 py-3 rounded-xl font-semibold
                                transition-all duration-200
                                ${activeTab === "about"
                                    ? "bg-[#3B9BEF] text-white shadow-md scale-[1.02]"
                                    : "text-slate-600 hover:bg-white hover:text-[#3B9BEF]"
                                }
                            `}
                            onClick={() => setActiveTab("about")}
                        >
                            ℹ️
                            <span>About</span>
                        </button>

                    </div>


                    {/* Tab Content */}

                    {activeTab === "general" && (
                        <Preferences />
                    )}

                    {activeTab === "account" && (
                        <div className="space-y-8">
                            <ProfileSection />
                            <ChangePassword />
                            <LogoutButton />
                        </div>
                    )}

                    {activeTab === "guide" && (
                        <UserGuide />
                    )}

                    {activeTab === "about" && (
                        <div>
                            <About />
                            <Terms />
                        </div>
                    )}

                </div>

            </PageContainer>
        </DashboardLayout>
    );
}