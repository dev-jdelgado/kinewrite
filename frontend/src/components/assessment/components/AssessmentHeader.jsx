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
                rounded-2xl
                shadow-sm
                mt-5
            "
        >
            <div
                className="
                    max-w-7xl
                    mx-auto
                    md:px-8
                    px-4
                    py-5
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-1
                "
            >

                {/* ============================ */}
                {/* Back Button */}
                {/* ============================ */}

                <div
                    className="
                        w-auto
                        flex
                        justify-start
                    "
                >
                    {showBackButton && (
                        <button
                            type="button"
                            onClick={() => navigate(backPath)}
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

                            <span className="font-semibold">
                                Back
                            </span>
                        </button>
                    )}
                </div>


                {/* ============================ */}
                {/* Logo */}
                {/* ============================ */}

                <div
                    className="
                        w-auto
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


                {/* ============================ */}
                {/* Title / Instruction */}
                {/* ============================ */}

                <div
                    className="
                        w-full
                        text-center
                    "
                >
                    <h1
                        className="
                            md:text-4xl text-3xl
                            font-extrabold
                            text-[#9b4c00]
                        "
                    >
                        {title}
                    </h1>

                    {subtitle && (
                        <p
                            className="
                                mt-2
                                text-lg
                                text-slate-600
                            "
                        >
                            {subtitle}
                        </p>
                    )}
                </div>

            </div>
        </header>

    );

};

export default AssessmentHeader;