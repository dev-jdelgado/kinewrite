import {
    RotateCcw,
    Send,
    Trash2,
} from "lucide-react";

const HandwritingToolbar = ({
    elapsedTime,
    onClear,
    onSubmit,
    isSubmitting = false,
}) => {

    const formatTime = (seconds) => {

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${String(mins).padStart(2, "0")}:${String(
            secs
        ).padStart(2, "0")}`;

    };

    return (

        <div
            className="
                bg-white
                rounded-3xl
                shadow-lg
                border
                p-6
                mt-8
            "
        >
            <div
                className="
                    flex
                    flex-col
                    lg:flex-row
                    items-center
                    justify-between
                    gap-6
                "
            >

                {/* Timer */}
                <div
                    className="
                        text-center
                        lg:text-left
                    "
                >
                    <p
                        className="
                            text-sm
                            font-medium
                            text-slate-500
                        "
                    >
                        Time Elapsed
                    </p>

                    <h2
                        className="
                            mt-1
                            text-3xl
                            font-bold
                            text-[#9b4c00]
                        "
                    >
                        {formatTime(elapsedTime)}
                    </h2>
                </div>

                {/* Buttons */}
                <div
                    className="
                        flex
                        flex-wrap
                        justify-center
                        gap-4
                    "
                >

                    {/* Clear */}
                    <button
                        type="button"
                        onClick={onClear}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-6
                            py-3
                            font-semibold
                            text-red-600
                            hover:bg-red-100
                            transition-all
                        "
                    >
                        <Trash2 size={20} />
                        Clear
                    </button>

                    {/* Restart */}
                    <button
                        type="button"
                        onClick={onClear}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-orange-200
                            bg-orange-50
                            px-6
                            py-3
                            font-semibold
                            text-orange-600
                            hover:bg-orange-100
                            transition-all
                        "
                    >
                        <RotateCcw size={20} />
                        Start Over
                    </button>

                    {/* Submit */}
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-[#9b4c00]
                            px-8
                            py-3
                            font-semibold
                            text-white
                            hover:bg-[#7b3b00]
                            transition-all
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        <Send size={20} />
                        {

                            isSubmitting

                                ? "Submitting..."

                                : "Submit Writing"

                        }

                    </button>

                </div>
            </div>
        </div>
    );
};

export default HandwritingToolbar;