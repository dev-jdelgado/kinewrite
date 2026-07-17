import BackButton from "../../common/BackButton";

import KineWriteLogo from "../../../assets/logo.png";

const ActivityCard = ({

    title,

    instruction,

    color = "#38BDF8",

    activityNumber,

    totalActivities,

}) => {

    return (

        <div
            className="
                bg-white
                rounded-[36px]
                shadow-xl
                px-8
                py-6
                mb-8
            "
        >

            {/* ========================================== */}
            {/* Top Row */}
            {/* ========================================== */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                <BackButton
                    label="Back"
                />

                <img
                    src={KineWriteLogo}
                    alt="KineWrite"
                    className="
                        h-16
                        object-contain
                    "
                />

            </div>

            {/* ========================================== */}
            {/* Title */}
            {/* ========================================== */}

            <div
                className="
                    mt-8
                    text-center
                "
            >

                <h1
                    className="
                        text-6xl
                        font-black
                        uppercase
                        tracking-wide
                    "
                    style={{
                        color,
                    }}
                >
                    {title}
                </h1>

                <p
                    className="
                        mt-4
                        text-xl
                        text-slate-600
                        max-w-4xl
                        mx-auto
                        leading-relaxed
                    "
                >
                    {instruction}
                </p>

            </div>

            {/* ========================================== */}
            {/* Progress */}
            {/* ========================================== */}

            <div
                className="
                    mt-8
                    flex
                    justify-center
                "
            >

                <div
                    className="
                        rounded-full
                        px-8
                        py-3
                        text-2xl
                        font-bold
                        text-white
                        shadow-lg
                    "
                    style={{
                        backgroundColor: color,
                    }}
                >

                    {activityNumber}
                    {" / "}
                    {totalActivities}

                </div>

            </div>

        </div>

    );

};

export default ActivityCard;