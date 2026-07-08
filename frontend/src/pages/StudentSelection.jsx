import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import BackButton from "../components/common/BackButton";
import Loader from "../components/common/Loader";

import logo from "../assets/logo.png";

import cloud from "../assets/student-selection/cloud.png";
import watermark from "../assets/student-selection/watermark.png";

import { useStudents } from "../contexts/StudentContext";

const avatarColors = [
    "from-yellow-400 to-amber-500",
    "from-red-500 to-rose-600",
    "from-cyan-500 to-sky-600",
    "from-lime-500 to-green-600",
    "from-violet-500 to-purple-700",
    "from-pink-500 to-fuchsia-600",
    "from-orange-500 to-amber-600",
    "from-blue-500 to-indigo-600",
];

const StudentSelection = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { students, loading } = useStudents();
    const [search] = useState("");
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode") || "exercise";
    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const keyword = search.toLowerCase();
            return (
                `${student.student_fname} ${student.student_lname}`
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [students, search]);

    const handleStudentClick = (student) => {
        if (mode === "records") {
            navigate(`/student-records/${student.student_id}`);
            return;
        }
        navigate(`/exercise/${student.student_id}`);
    };

    return (

        <DashboardLayout>

            <div
                className="
                    relative
                    min-h-screen
                    overflow-hidden
                    bg-[#F58200]
                "
            >

                {/* Watermark */}
                <div
                    className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        pointer-events-none
                        select-none
                    "
                >
                    <img
                        src={watermark}
                        alt=""
                        className="
                            md:max-w-[900px] max-w-[650px]
                            opacity-10
                            select-none
                            pointer-events-none
                        "
                    />
                </div>

                {/* Back */}
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

                {/* Main */}

                <div
                    className="
                        relative
                        z-30
                        flex
                        flex-col
                        items-center
                        lg:pt-28 pt-40
                        px-10
                    "
                >
                    <h1
                        className="
                            lg:text-6xl md:text-5xl text-3xl
                            font-extrabold
                            text-white
                            drop-shadow-lg
                            text-center
                        "
                    >
                        Welcome Back!
                    </h1>
                    <p
                        className="
                            mt-3
                            lg:text-2xl md:text-xl text-lg
                            text-white
                            text-center
                        "
                    >
                        Choose your profile to continue your learning journey
                    </p>
                    {
                        loading
                            ?
                            (
                                <div className="mt-32">
                                    <Loader />
                                </div>
                            )
                            :
                            (
                                <div
                                    className="
                                        mt-20
                                        grid
                                        grid-cols-2
                                        md:grid-cols-3
                                        lg:grid-cols-5
                                        lg:gap-x-5 gap-x-12 gap-y-5
                                    "
                                >
                                    {
                                        filteredStudents.map((student, index) => (
                                            <button
                                                key={student.student_id}
                                                onClick={() =>
                                                    handleStudentClick(student)
                                                }
                                                className="
                                                    group
                                                    flex
                                                    flex-col
                                                    items-center justify-content-evenly
                                                "
                                            >
                                                <div
                                                    className={`
                                                        sm:w-45 w-32
                                                        sm:h-45 h-32
                                                        rounded-3xl
                                                        bg-gradient-to-br
                                                        ${avatarColors[index % avatarColors.length]}
                                                        shadow-2xl
                                                        transition-all
                                                        duration-300
                                                        group-hover:scale-110
                                                        group-hover:-translate-y-2
                                                        flex
                                                        items-center
                                                        justify-center
                                                    `}
                                                >
                                                    <span className="sm:text-8xl text-7xl">
                                                        {
                                                            student.student_gender === "Female"
                                                                ? "👧"
                                                                : "👦"
                                                        }
                                                    </span>
                                                </div>
                                                <h2
                                                    className="
                                                        lg:mt-3 sm:mt-2 mt-1
                                                        lg:text-3xl sm:text-2xl text-lg
                                                        font-bold
                                                        text-white
                                                    "
                                                >
                                                    {student.student_fname}
                                                </h2>
                                            </button>
                                        ))
                                    }
                                </div>
                            )
                    }

                    {/* Bottom Card */}

                    <div
                        className="
                            mt-24
                            mb-10
                            w-full
                            max-w-6xl
                            rounded-[40px]
                            bg-[#8C4B09]/80
                            backdrop-blur-md
                            sm:px-14 px-5
                            sm:py-10 py-5
                        "
                    >
                        <div
                            className="
                                grid
                                grid-cols-2
                                md:grid-cols-4
                                sm:gap-10 gap-5
                                text-center
                            "
                        >
                            <div>
                                <div className="sm:text-6xl text-5xl">🎮</div>
                                <h3 className="mt-3 text-white sm:text-2xl text-lg font-bold">
                                    Learn
                                </h3>
                                <p className="text-white/90">
                                    Through Play
                                </p>
                            </div>

                            <div>
                                <div className="sm:text-6xl text-5xl">⭐</div>
                                <h3 className="mt-3 text-white sm:text-2xl text-lg font-bold">
                                    Earn
                                </h3>
                                <p className="text-white/90">
                                    Badges & Rewards
                                </p>
                            </div>

                            <div>
                                <div className="sm:text-6xl text-5xl">🎯</div>
                                <h3 className="mt-3 text-white sm:text-2xl text-lg font-bold">
                                    Track
                                </h3>
                                <p className="text-white/90">
                                    Your Progress
                                </p>
                            </div>

                            <div>
                                <div className="sm:text-6xl text-5xl">❤️</div>
                                <h3 className="mt-3 text-white sm:text-2xl text-lg font-bold">
                                    Feel
                                </h3>
                                <p className="text-white/90">
                                    Confident
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
                <img
                    src={cloud}
                    alt=""
                    className="
                        absolute
                        -bottom-[10vw]
                        -left-[10%]
                        sm:w-[50vw] w-[65vw]
                        pointer-events-none
                        select-none
                        z-30
                    "
                />
                <img
                    src={cloud}
                    alt=""
                    className="
                        absolute
                        -bottom-[10vw]
                        left-[30vw]
                        w-[45vw]
                        pointer-events-none
                        select-none
                        z-30
                        sm:block hidden
                    "
                />
                <img
                    src={cloud}
                    alt=""
                    className="
                        absolute
                        -bottom-[10vw]
                        -right-[10vw]
                        sm:w-[50vw] w-[65vw]
                        pointer-events-none
                        select-none
                        z-20
                    "
                />
            </div>
        </DashboardLayout>
    );
};

export default StudentSelection;