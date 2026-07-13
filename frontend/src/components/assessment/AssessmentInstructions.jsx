import {
    Eye,
    Pencil,
    Eraser,
    Smile,
    ArrowRight,
} from "lucide-react";

import { useAssessment } from "../../contexts/AssessmentContext";

const AssessmentInstructions = () => {

    const {
        nextStep,
    } = useAssessment();

    const instructions = [
        {
            icon: <Eye size={34} />,
            title: "Look Carefully",
            description:
                "Read the sentence carefully before you begin writing.",
        },
        {
            icon: <Pencil size={34} />,
            title: "Write Inside the Lines",
            description:
                "Write neatly and stay inside the writing lines.",
        },
        {
            icon: <Eraser size={34} />,
            title: "You Can Try Again",
            description:
                "If you make a mistake, you can erase and write again.",
        },
        {
            icon: <Smile size={34} />,
            title: "Do Your Best!",
            description:
                "Take your time and do your very best. Have fun!",
        },
    ];

    return (

        <div
            className="
                max-w-6xl
                mx-auto
            "
        >

            {/* Header */}
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
                    📖
                </div>
                <h1
                    className="
                        mt-8
                        text-5xl
                        font-extrabold
                        text-[#9b4c00]
                    "
                >
                    Before We Start
                </h1>
                <p
                    className="
                        mt-5
                        text-2xl
                        text-slate-600
                        max-w-3xl
                        mx-auto
                        leading-relaxed
                    "
                >
                    Let's read a few simple instructions first.
                </p>
            </div>

            {/* Instruction Cards */}
            <div
                className="
                    mt-14
                    grid
                    md:grid-cols-2
                    gap-8
                "
            >
                {
                    instructions.map((instruction) => (

                        <div
                            key={instruction.title}
                            className="
                                bg-white
                                rounded-3xl
                                shadow-lg
                                border
                                p-8
                                hover:shadow-xl
                                transition-all
                            "
                        >

                            <div
                                className="
                                    w-20
                                    h-20
                                    rounded-full
                                    bg-orange-100
                                    text-orange-600
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                {instruction.icon}

                            </div>

                            <h2
                                className="
                                    mt-6
                                    text-2xl
                                    font-bold
                                    text-slate-800
                                "
                            >
                                {instruction.title}
                            </h2>

                            <p
                                className="
                                    mt-4
                                    text-lg
                                    leading-relaxed
                                    text-slate-600
                                "
                            >
                                {instruction.description}
                            </p>
                        </div>
                    ))
                }
            </div>

            {/* Ready Card */}
            <div
                className="
                    mt-16
                    bg-orange-50
                    border
                    border-orange-200
                    rounded-3xl
                    p-10
                    text-center
                "
            >

                <h2
                    className="
                        text-3xl
                        font-bold
                        text-[#9b4c00]
                    "
                >
                    ⭐ Ready to Start?
                </h2>

                <p
                    className="
                        mt-4
                        text-xl
                        text-slate-700
                    "
                >
                    When you're ready,
                    press the button below to begin
                    your handwriting activity.
                </p>

                <button
                    onClick={nextStep}
                    className="
                        mt-10
                        inline-flex
                        items-center
                        gap-3
                        rounded-2xl
                        bg-[#9b4c00]
                        hover:bg-[#7a3b00]
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

                    Start Writing
                    <ArrowRight size={24} />

                </button>
            </div>
        </div>
    );
};

export default AssessmentInstructions;