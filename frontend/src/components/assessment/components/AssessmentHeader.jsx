import {
    ArrowLeft,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import KineWriteLogo from "../../../assets/logo.png";

const AssessmentHeader = ({

    title,

    subtitle,

    showBackButton = true,

    backPath = "/student-selection?mode=exercise",

}) => {

    const navigate =
        useNavigate();

    return (

        <header
            className="
                sticky
                top-0
                z-50

                bg-white

                border-b
                border-slate-200

                shadow-sm
            "
        >

            <div
                className="
                    max-w-7xl
                    mx-auto

                    px-8
                    py-5

                    flex
                    items-center
                    justify-between
                "
            >

                {/* ============================ */}
                {/* Back Button */}
                {/* ============================ */}

                <div
                    className="
                        w-52
                    "
                >

                    {

                        showBackButton && (

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(backPath)
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-3

                                    rounded-xl

                                    px-5
                                    py-3

                                    bg-slate-100

                                    hover:bg-slate-200

                                    transition-all
                                "
                            >

                                <ArrowLeft size={20} />

                                <span
                                    className="
                                        font-semibold
                                    "
                                >

                                    Back

                                </span>

                            </button>

                        )

                    }

                </div>

                {/* ============================ */}
                {/* Title */}
                {/* ============================ */}

                <div
                    className="
                        flex-1
                        text-center
                    "
                >

                    <h1
                        className="
                            text-4xl
                            font-extrabold
                            text-[#9b4c00]
                        "
                    >
                        {title}
                    </h1>

                    {

                        subtitle && (

                            <p
                                className="
                                    mt-2
                                    text-lg
                                    text-slate-600
                                "
                            >

                                {subtitle}

                            </p>

                        )

                    }

                </div>

                {/* ============================ */}
                {/* Logo */}
                {/* ============================ */}

                <div
                    className="
                        w-52

                        flex
                        justify-end
                    "
                >

                    <img
                        src={KineWriteLogo}
                        alt="KineWrite"
                        className="
                            h-14
                            object-contain
                        "
                    />

                </div>

            </div>

        </header>

    );

};

export default AssessmentHeader;