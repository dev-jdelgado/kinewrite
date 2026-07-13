import {
    Sparkles,
    Clock3,
    Pencil,
    Heart,
    ArrowRight,
} from "lucide-react";

import { useAssessment } from "../../contexts/AssessmentContext";

import cloudImage from "../../assets/images/cloud.png";
import watermarkImage from "../../assets/images/watermark.png";

const AssessmentIntro = () => {

    const {
        student,
        nextStep,
    } = useAssessment();

    return (

        <div
            className="
                relative
                overflow-hidden
                rounded-3xl
                bg-[#FFF8ED]
                p-10
                min-h-[650px]
            "
        >

            {/* Clouds */}
            <img
                src={cloudImage}
                alt=""
                className="
                    absolute
                    top-0
                    left-0
                    w-full
                    object-cover
                    pointer-events-none
                    opacity-80
                "
            />

            {/* Watermark */}
            <img
                src={watermarkImage}
                alt=""
                className="
                    absolute
                    bottom-0
                    right-0
                    w-[380px]
                    opacity-10
                    pointer-events-none
                "
            />

            {/* Content */}
            <div className="relative z-10">

                {/* Welcome */}
                <div className="text-center">
                    <div
                        className="
                            w-28
                            h-28
                            mx-auto
                            rounded-full
                            bg-orange-100
                            flex
                            items-center
                            justify-center
                            text-orange-600
                            shadow-lg
                        "
                    >
                        <Sparkles size={50} />
                    </div>

                    <h1
                        className="
                            mt-8
                            text-5xl
                            font-extrabold
                            text-[#9b4c00]
                        "
                    >
                        Hello,
                        {" "}
                        {student?.student_fname || "Student"}!
                        👋
                    </h1>

                    <p
                        className="
                            mt-6
                            text-2xl
                            text-slate-700
                            max-w-3xl
                            mx-auto
                            leading-relaxed
                        "
                    >
                        Today we're going to do a fun handwriting
                        activity together.
                    </p>

                    <p
                        className="
                            mt-4
                            text-lg
                            text-slate-600
                            max-w-3xl
                            mx-auto
                            leading-relaxed
                        "
                    >
                        Don't worry if you make mistakes.
                        There are no wrong answers.
                        Just write as neatly as you can and
                        have fun!
                    </p>
                </div>

                {/* Cards */}
                <div
                    className="
                        mt-14
                        grid
                        md:grid-cols-3
                        gap-8
                    "
                >
                    <InfoCard
                        icon={<Clock3 size={34} />}
                        title="About 5 Minutes"
                        description="The activity is short and easy."
                    />
                    <InfoCard
                        icon={<Pencil size={34} />}
                        title="Write Carefully"
                        description="Take your time and write neatly."
                    />
                    <InfoCard
                        icon={<Heart size={34} />}
                        title="Do Your Best"
                        description="Just try your best and enjoy!"
                    />
                </div>

                {/* Motivation */}
                <div
                    className="
                        mt-16
                        rounded-3xl
                        bg-white
                        shadow-lg
                        p-8
                        border
                    "
                >
                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-[#9b4c00]
                        "
                    >
                        ⭐ Are you ready?
                    </h2>

                    <p
                        className="
                            mt-4
                            text-slate-700
                            leading-relaxed
                            text-lg
                        "
                    >
                        Press the button below when you're ready.
                        We'll show you the writing activity next.
                    </p>

                    <div className="mt-8 text-center">
                        <button
                            onClick={nextStep}
                            className="
                                inline-flex
                                items-center
                                gap-3
                                rounded-2xl
                                bg-[#9b4c00]
                                hover:bg-[#7b3b00]
                                px-10
                                py-5
                                text-xl
                                font-bold
                                text-white
                                transition-all
                                hover:scale-105
                                shadow-xl
                            "
                        >
                            Let's Begin!
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoCard = ({
    icon,
    title,
    description,
}) => {

    return (

        <div
            className="
                rounded-3xl
                bg-white
                shadow-lg
                p-8
                text-center
                hover:shadow-xl
                transition-all
            "
        >

            <div
                className="
                    w-20
                    h-20
                    mx-auto
                    rounded-full
                    bg-orange-100
                    text-orange-600
                    flex
                    items-center
                    justify-center
                "
            >

                {icon}

            </div>

            <h3
                className="
                    mt-6
                    text-xl
                    font-bold
                    text-slate-800
                "
            >
                {title}
            </h3>

            <p
                className="
                    mt-3
                    text-slate-600
                    leading-relaxed
                "
            >
                {description}
            </p>
        </div>
    );
};

export default AssessmentIntro;