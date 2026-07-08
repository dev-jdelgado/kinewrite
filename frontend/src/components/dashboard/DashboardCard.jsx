import React from "react";

const DashboardCard = ({
    title,
    image,
    icon,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className="
                group
                relative
                overflow-hidden
                rounded-4xl
                bg-white
                shadow-lg
                hover:shadow-2xl
                hover:-translate-y-2
                duration-300
                transition-all
                w-full
                aspect-square
                border-[6px]
                border-white
            "
        >
            <img
                src={image}
                alt={title}
                className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                "
            />

            <div
                className="
                    absolute
                    inset-0
                    bg-[#9b4c00]/45
                    transition-all
                    duration-300
                    group-hover:bg-[#9b4c00]/70
                "
            />

            <div
                className="
                    absolute
                    inset-0
                    flex
                    flex-col
                    justify-center
                    items-center
                    p-6
                "
            >
                <div
                    className="
                        bg-[#F7E4C0]
                        rounded-3xl
                        p-8
                        shadow-xl
                    "
                >
                    <img
                        src={icon}
                        alt={title}
                        className="w-24 h-24 object-contain transition-transform duration-700 group-hover:rotate-360"
                    />
                </div>

                <h2
                    className="
                        mt-6
                        text-white
                        text-4xl
                        font-bold
                        drop-shadow-lg
                        text-center
                    "
                >
                    {title}
                </h2>
            </div>
        </button>
    );
};

export default DashboardCard;