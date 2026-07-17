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
                max-w-[350px]
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
                    bg-[#7ec8ff]/45
                    transition-all
                    duration-300
                    group-hover:bg-[#43a7f3]/55
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
                        bg-[#7ec8ff]
                        rounded-3xl
                        xl:p-8 sm:p-6 p-5
                        shadow-xl
                    "
                >
                    <img
                        src={icon}
                        alt={title}
                        className="xl:w-24 xl:h-24 w-20 h-20 object-contain transition-transform duration-700 group-hover:rotate-360"
                    />
                </div>

                <h2
                    className="
                        xl:mt-6 md:mt-2 mt-3
                        text-white
                        xl:text-4xl text-3xl
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