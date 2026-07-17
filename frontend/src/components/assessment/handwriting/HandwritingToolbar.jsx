import {
    Check,
    Eraser,
} from "lucide-react";

const HandwritingToolbar = ({

    onClear,

    onCheck,

    disableCheck = false,

}) => {

    return (

        <div
            className="
                flex
                justify-center
                items-center
                gap-8
            "
        >

            {/* Clear */}

            <button
                type="button"
                onClick={onClear}
                className="
                    flex
                    items-center
                    justify-center
                    gap-3

                    w-60
                    h-16

                    rounded-full

                    bg-gradient-to-b
                    from-slate-400
                    to-slate-600

                    shadow-xl

                    text-white
                    text-3xl
                    font-bold

                    transition-all
                    duration-200

                    hover:scale-105
                    active:scale-95
                "
            >

                <Eraser size={34} />

                CLEAR

            </button>

            {/* Check */}

            <button
                type="button"
                onClick={onCheck}
                disabled={disableCheck}
                className="
                    flex
                    items-center
                    justify-center
                    gap-3

                    w-60
                    h-16

                    rounded-full

                    bg-gradient-to-b
                    from-lime-400
                    to-green-600

                    shadow-xl

                    text-white
                    text-3xl
                    font-bold

                    transition-all
                    duration-200

                    hover:scale-105
                    active:scale-95

                    disabled:opacity-50
                    disabled:cursor-not-allowed
                "
            >

                <Check size={34} />

                CHECK

            </button>

        </div>

    );

};

export default HandwritingToolbar;