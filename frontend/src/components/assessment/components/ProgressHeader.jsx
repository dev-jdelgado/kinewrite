const ProgressHeader = ({

    current,

    total,

    color = "#38BDF8",

}) => {

    const percentage =
        (current / total) * 100;

    return (

        <div
            className="
                w-full
                max-w-4xl
                mx-auto
                mt-6
                mb-8
            "
        >

            {/* Progress Text */}

            <div
                className="
                    flex
                    justify-between
                    items-center
                    mb-3
                "
            >

                <h3
                    className="
                        text-lg
                        font-bold
                        text-slate-700
                    "
                >
                    Activity Progress
                </h3>

                <span
                    className="
                        text-lg
                        font-bold
                    "
                    style={{
                        color,
                    }}
                >
                    {current} / {total}
                </span>

            </div>

            {/* Progress Bar */}

            <div
                className="
                    w-full
                    h-5
                    bg-slate-200
                    rounded-full
                    overflow-hidden
                "
            >

                <div
                    className="
                        h-full
                        rounded-full
                        transition-all
                        duration-500
                    "
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                    }}
                />

            </div>

        </div>

    );

};

export default ProgressHeader;