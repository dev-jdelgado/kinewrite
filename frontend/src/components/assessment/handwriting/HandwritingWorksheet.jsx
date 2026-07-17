import { forwardRef } from "react";

import HandwritingCanvas from "./HandwritingCanvas";

const HandwritingWorksheet = forwardRef(({

        word,

    }, ref) => {

    return (

        <div
            className="
                relative
                w-full
                h-[600px]
                rounded-[40px]
                border-[5px]
                border-sky-500
                bg-white
                shadow-2xl
                overflow-hidden
            "
        >

            {/* ===================================== */}
            {/* Tracing Guide */}
            {/* ===================================== */}

            <div
                className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    pointer-events-none
                    select-none
                "
            >

                <span
                    className="
                        text-[19vw]
                        tracking-[0.2em]
                        text-slate-300
                        opacity-70
                    "
                >
                    {word}
                </span>

            </div>

            {/* ===================================== */}
            {/* Drawing Canvas */}
            {/* ===================================== */}

            <HandwritingCanvas ref={ref} />

        </div>

    );

});

HandwritingWorksheet.displayName =
    "HandwritingWorksheet";

export default HandwritingWorksheet;