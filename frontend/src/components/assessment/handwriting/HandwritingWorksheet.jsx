const HandwritingWorksheet = () => {

    const rows = 5;

    return (

        <div
            className="
                relative
                w-full
                rounded-3xl
                bg-white
                border-2
                border-orange-200
                overflow-hidden
                shadow-inner
            "
        >

            {/* Paper Background */}
            <div
                className="
                    absolute
                    inset-0
                    bg-[#fffdf8]
                "
            />

            {/* Worksheet */}
            <div className="relative">
                {
                    Array.from({ length: rows }).map((_, index) => (
                        <div
                            key={index}
                            className="
                                relative
                                h-40
                                border-b
                                border-orange-100
                            "
                        >

                            {/* Top Guideline */}
                            <div
                                className="
                                    absolute
                                    left-0
                                    right-0
                                    top-8
                                    border-t-2
                                    border-blue-300
                                "
                            />

                            {/* Middle Guideline */}
                            <div
                                className="
                                    absolute
                                    left-0
                                    right-0
                                    top-20
                                    border-t-2
                                    border-dashed
                                    border-gray-300
                                "
                            />

                            {/* Baseline */}
                            <div
                                className="
                                    absolute
                                    left-0
                                    right-0
                                    bottom-8
                                    border-t-2
                                    border-blue-300
                                "
                            />

                            {/* Left Margin */}
                            <div
                                className="
                                    absolute
                                    top-0
                                    bottom-0
                                    left-20
                                    border-l-2
                                    border-red-300
                                "
                            />

                        </div>

                    ))
                }
            </div>
        </div>
    );
};

export default HandwritingWorksheet;