import {
    Layers3,
    Target,
    Trophy,
    PenTool,
} from "lucide-react";

const ProgressSummaryCards = ({
    student,
}) => {

    if (!student) return null;

    const cards = [
        {
            title: "Current Level",
            value: student.student_current_level || 1,
            icon: Layers3,
            color: `
                bg-blue-100
                text-blue-600
                dark:bg-blue-950/60
                dark:text-blue-400
            `,
        },
        {
            title: "Classification",
            value: student.student_classification || "Pending",
            icon: Target,
            color: `
                bg-green-100
                text-green-600
                dark:bg-green-950/60
                dark:text-green-400
            `,  
        },
        {
            title: "Completed Exercises",
            value: student.completed_exercises ?? 0,
            icon: PenTool,
            color: `
                bg-orange-100
                text-orange-600
                dark:bg-orange-950/60
                dark:text-orange-400
            `,
        },
        {
            title: "Total Stars",
            value: student.total_stars ?? 0,
            icon: Trophy,
            color: `
                bg-yellow-100
                text-yellow-600
                dark:bg-yellow-950/60
                dark:text-yellow-400
            `,
        },
    ];

    return (

        <div
            className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-4
                gap-6
                mb-8
            "
        >
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.title}
                        className="
                            bg-white
                            dark:bg-slate-800
                            rounded-3xl
                            shadow-lg
                            dark:shadow-black/30
                            p-6
                            flex
                            items-center
                            justify-between
                            hover:shadow-xl
                            dark:hover:shadow-black/40
                            transition-all
                            duration-300
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {card.title}
                            </p>

                            <h2
                                className="
                                    mt-2
                                    text-3xl
                                    font-bold
                                    text-slate-800
                                    dark:text-white
                                "
                            >
                                {card.value}
                            </h2>
                        </div>

                        <div
                            className={`
                                w-16
                                h-16
                                rounded-2xl
                                flex
                                items-center
                                justify-center
                                ${card.color}
                            `}
                        >
                            <Icon size={30} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProgressSummaryCards;