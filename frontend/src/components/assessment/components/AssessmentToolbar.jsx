import {
    ArrowLeft,
    ArrowRight,
    LoaderCircle,
} from "lucide-react";

const AssessmentToolbar = ({

    onBack,

    onNext,

    backLabel = "Back",

    nextLabel = "Continue",

    showBack = true,

    showNext = true,

    isLoading = false,

    nextDisabled = false,

    nextIcon = null,

}) => {

    return (

        <div
            className="
                mt-10
                flex
                items-center
                justify-between
            "
        >

            {/* ========================================= */}
            {/* Back Button */}
            {/* ========================================= */}

            <div>

                {

                    showBack && (

                        <button
                            type="button"
                            onClick={onBack}
                            className="
                                inline-flex
                                items-center
                                gap-3

                                rounded-2xl

                                bg-slate-200

                                px-8
                                py-4

                                text-lg
                                font-semibold
                                text-slate-700

                                hover:bg-slate-300

                                transition-all
                            "
                        >

                            <ArrowLeft size={22} />

                            {backLabel}

                        </button>

                    )

                }

            </div>

            {/* ========================================= */}
            {/* Next Button */}
            {/* ========================================= */}

            <div>

                {

                    showNext && (

                        <button
                            type="button"
                            onClick={onNext}
                            disabled={
                                isLoading ||
                                nextDisabled
                            }
                            className="
                                inline-flex
                                items-center
                                gap-3

                                rounded-2xl

                                bg-[#9b4c00]

                                px-10
                                py-4

                                text-lg
                                font-bold
                                text-white

                                hover:bg-[#7b3b00]

                                transition-all

                                disabled:opacity-60
                                disabled:cursor-not-allowed
                            "
                        >

                            {

                                isLoading

                                    ? (

                                        <LoaderCircle
                                            size={22}
                                            className="
                                                animate-spin
                                            "
                                        />

                                    )

                                    : (

                                        nextIcon ||

                                        <ArrowRight
                                            size={22}
                                        />

                                    )

                            }

                            {

                                isLoading

                                    ? "Loading..."

                                    : nextLabel

                            }

                        </button>

                    )

                }

            </div>

        </div>

    );

};

export default AssessmentToolbar;