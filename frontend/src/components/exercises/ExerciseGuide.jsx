const ExerciseGuide = ({ mode, prompt }) => {

    // =====================================================
    // TEXT-BASED ACTIVITIES
    // =====================================================

    if (
        [
            "copy-word",
            "copy-phrase",
            "complete-sentence",
            "copy-sentence",
            "spacing-challenge",
        ].includes(mode)
    ) {

        return (
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    flex
                    flex-col
                    items-center
                    justify-center
                    z-0
                "
            >

                <div
                    className="
                        text-xs
                        font-black
                        uppercase
                        tracking-[0.25em]
                        text-slate-400
                        mb-6
                    "
                >
                    {mode === "spacing-challenge"
                        ? "Rewrite With Correct Spacing"
                        : "Copy the Model"}
                </div>


                <div
                    className="
                        text-6xl
                        md:text-7xl
                        font-black
                        text-slate-300
                        text-center
                        px-8
                        break-words
                        max-w-[90%]
                    "
                >
                    {prompt}
                </div>


                <div
                    className="
                        absolute
                        left-[8%]
                        right-[8%]
                        bottom-[22%]
                        border-b-4
                        border-sky-200
                    "
                />

            </div>
        );

    }


    // =====================================================
    // ALIGNMENT — WRITE ON LINE
    // =====================================================

    if (
        mode === "write-line" ||
        mode === "follow-line"
    ) {

        return (
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    z-0
                "
            >

                <div
                    className="
                        absolute
                        left-[8%]
                        right-[8%]
                        top-[58%]
                        border-b-4
                        border-orange-300
                    "
                />


                <div
                    className="
                        absolute
                        left-[8%]
                        right-[8%]
                        top-[48%]
                        border-b-2
                        border-dashed
                        border-orange-100
                    "
                />

            </div>
        );

    }


    // =====================================================
    // ALIGNMENT — RULED SENTENCE
    // =====================================================

    if (
        mode === "ruled-sentence"
    ) {

        return (
            <div
                className="
                    absolute
                    inset-[10%]
                    pointer-events-none
                    z-0
                "
            >

                {[15, 35, 55, 75].map(
                    (top) => (

                        <div
                            key={top}
                            className="
                                absolute
                                left-0
                                right-0
                                border-b-2
                                border-orange-200
                            "
                            style={{
                                top: `${top}%`,
                            }}
                        />

                    )
                )}

            </div>
        );

    }


    // =====================================================
    // ALIGNMENT — STAY INSIDE BOX
    // =====================================================

    if (
        mode === "stay-box"
    ) {

        return (
            <div
                className="
                    absolute
                    inset-[15%]
                    border-4
                    border-dashed
                    border-orange-300
                    rounded-3xl
                    pointer-events-none
                    z-0
                "
            >

                <div
                    className="
                        absolute
                        -top-4
                        left-6
                        px-4
                        py-1
                        rounded-full
                        bg-orange-100
                        text-orange-700
                        text-xs
                        font-black
                    "
                >
                    STAY INSIDE
                </div>

            </div>
        );

    }


    // =====================================================
    // ALIGNMENT — PATH
    // =====================================================

    if (
        mode === "alignment-path"
    ) {

        return (
            <svg
                className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    pointer-events-none
                    z-0
                "
                viewBox="0 0 1000 500"
                preserveAspectRatio="none"
            >

                <path
                    d="
                        M 70 300
                        C 200 220,
                          300 380,
                          430 290
                        S 700 210,
                          930 300
                    "
                    fill="none"
                    stroke="#fdba74"
                    strokeWidth="10"
                    strokeDasharray="18 12"
                    strokeLinecap="round"
                />

            </svg>
        );

    }


    // =====================================================
    // STROKE — TRACE LINES
    // =====================================================

    if (
        mode === "trace-line"
    ) {

        const paths = {

            Horizontal:
                "M 150 250 L 850 250",

            Vertical:
                "M 500 100 L 500 400",

            Diagonal:
                "M 250 380 L 750 120",

            Zigzag:
                "M 150 300 L 300 150 L 450 300 L 600 150 L 850 300",

            Wave:
                "M 100 250 C 180 100 260 400 340 250 S 500 100 580 250 S 740 400 820 250",

            Curves:
                "M 180 350 C 250 100 750 100 820 350",

        };


        const path =
            paths[prompt];


        if (!path) {
            return null;
        }


        return (
            <svg
                className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    pointer-events-none
                    z-0
                "
                viewBox="0 0 1000 500"
                preserveAspectRatio="none"
            >

                <path
                    d={path}
                    fill="none"
                    stroke="#86efac"
                    strokeWidth="18"
                    strokeDasharray="20 14"
                    strokeLinecap="round"
                />

            </svg>
        );

    }


    // =====================================================
    // STROKE — TRACE SHAPES
    // =====================================================

    if (
        mode === "trace-shape"
    ) {

        const common = {

            fill: "none",

            stroke: "#86efac",

            strokeWidth: 14,

            strokeDasharray: "20 14",

        };


        return (
            <svg
                className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    pointer-events-none
                    z-0
                "
                viewBox="0 0 1000 500"
            >

                {prompt === "Circle" && (
                    <circle
                        {...common}
                        cx="500"
                        cy="250"
                        r="150"
                    />
                )}


                {prompt === "Square" && (
                    <rect
                        {...common}
                        x="350"
                        y="100"
                        width="300"
                        height="300"
                    />
                )}


                {prompt === "Triangle" && (
                    <path
                        {...common}
                        d="
                            M 500 80
                            L 760 400
                            L 240 400
                            Z
                        "
                    />
                )}


                {prompt === "Rectangle" && (
                    <rect
                        {...common}
                        x="250"
                        y="150"
                        width="500"
                        height="200"
                    />
                )}


                {prompt === "Oval" && (
                    <ellipse
                        {...common}
                        cx="500"
                        cy="250"
                        rx="230"
                        ry="140"
                    />
                )}


                {prompt === "Diamond" && (
                    <path
                        {...common}
                        d="
                            M 500 80
                            L 760 250
                            L 500 420
                            L 240 250
                            Z
                        "
                    />
                )}


                {prompt === "Semicircle" && (
                    <path
                        {...common}
                        d="
                            M 250 320
                            A 250 250 0 0 1 750 320
                        "
                    />
                )}


                {prompt === "Heart" && (
                    <path
                        {...common}
                        d="
                            M 500 390
                            C 450 340 260 230 300 140
                            C 330 70 430 100 500 170
                            C 570 100 670 70 700 140
                            C 740 230 550 340 500 390
                        "
                    />
                )}


                {prompt === "Star" && (
                    <path
                        {...common}
                        d="
                            M 500 70
                            L 555 200
                            L 700 210
                            L 585 300
                            L 620 440
                            L 500 360
                            L 380 440
                            L 415 300
                            L 300 210
                            L 445 200
                            Z
                        "
                    />
                )}


                {prompt === "Spiral" && (
                    <path
                        {...common}
                        d="
                            M 500 250
                            C 500 170 620 170 620 250
                            C 620 350 430 360 400 250
                            C 360 110 700 60 760 250
                        "
                    />
                )}

            </svg>
        );

    }


    // =====================================================
    // STROKE — TRACE LETTER
    // =====================================================

    if (
        mode === "trace-letter"
    ) {

        return (
            <div
                className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    pointer-events-none
                    z-0
                "
            >

                <span
                    className="
                        text-[260px]
                        font-black
                        text-green-100
                        leading-none
                    "
                >
                    {prompt}
                </span>

            </div>
        );

    }


    // =====================================================
    // WRITE LETTER
    // =====================================================

    if (
        mode === "write-letter"
    ) {

        return (
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    flex
                    flex-col
                    items-center
                    justify-center
                    z-0
                "
            >

                <div
                    className="
                        text-xs
                        uppercase
                        tracking-[0.25em]
                        font-black
                        text-slate-400
                        mb-4
                    "
                >
                    Write Independently
                </div>


                <div
                    className="
                        text-[180px]
                        font-black
                        text-slate-200
                        leading-none
                    "
                >
                    {prompt}
                </div>

            </div>
        );

    }


    // =====================================================
    // STROKE CHALLENGE
    // =====================================================

    if (
        mode === "stroke-challenge"
    ) {

        return (
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    flex
                    flex-col
                    items-center
                    justify-center
                    z-0
                "
            >

                <div
                    className="
                        text-xs
                        uppercase
                        tracking-[0.25em]
                        font-black
                        text-green-500
                        mb-5
                    "
                >
                    Write Independently
                </div>


                <div
                    className="
                        text-7xl
                        font-black
                        text-green-100
                        tracking-wide
                    "
                >
                    {prompt}
                </div>

            </div>
        );

    }


    return null;
};


export default ExerciseGuide;