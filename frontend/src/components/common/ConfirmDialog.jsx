import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({
    open,
    title = "Confirm Action",
    message = "Are you sure you want to continue?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmColor = "bg-red-600 hover:bg-red-700",
    onConfirm,
    onCancel,
}) => {

    if (!open) return null;

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                dark:bg-black/70
                p-6
            "
        >
            <div
                className="
                    w-full
                    max-w-md
                    rounded-3xl
                    bg-white
                    dark:bg-slate-800
                    shadow-2xl
                    dark:shadow-black/50
                    overflow-hidden
                    transition-colors
                    duration-300
                "
            >
                <div className="p-8 text-center">
                    <div
                        className="
                            mx-auto
                            mb-6
                            flex
                            h-20
                            w-20
                            items-center
                            justify-center
                            rounded-full
                            bg-orange-100
                            dark:bg-orange-950/60
                        "
                    >
                        <AlertTriangle
                            size={42}
                            className="
                            text-[#9b4c00]
                            dark:text-orange-400"
                            
                        />
                    </div>
                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-slate-800
                            dark:text-white
                        "
                    >
                        {title}
                    </h2>
                    <p
                        className="
                            mt-4
                            text-slate-600
                            dark:text-slate-300
                            leading-relaxed
                        "
                    >
                        {message}
                    </p>
                </div>

                <div
                    className="
                        border-t
                        dark:border-slate-700
                        bg-slate-50
                        dark:bg-slate-900/60
                        px-6
                        py-5
                        flex
                        justify-end
                        gap-4
                    "
                >
                    <button
                        onClick={onCancel}
                        className="
                            rounded-xl
                            border
                            border-slate-300
                            dark:border-slate-600
                            px-6
                            py-3
                            font-semibold
                            text-slate-700
                            dark:text-slate-200
                            bg-white
                            dark:bg-slate-800
                            hover:bg-slate-100
                            dark:hover:bg-slate-700
                            transition-all
                        "
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`
                            rounded-xl
                            px-6
                            py-3
                            font-semibold
                            text-white
                            transition-all
                            ${confirmColor}
                        `}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;