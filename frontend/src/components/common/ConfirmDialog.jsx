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
                p-6
            "
        >
            <div
                className="
                    w-full
                    max-w-md
                    rounded-3xl
                    bg-white
                    shadow-2xl
                    overflow-hidden
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
                        "
                    >
                        <AlertTriangle
                            size={42}
                            className="text-[#9b4c00]"
                        />
                    </div>
                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-slate-800
                        "
                    >
                        {title}
                    </h2>
                    <p
                        className="
                            mt-4
                            text-slate-600
                            leading-relaxed
                        "
                    >
                        {message}
                    </p>
                </div>

                <div
                    className="
                        border-t
                        bg-slate-50
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
                            px-6
                            py-3
                            font-semibold
                            text-slate-700
                            hover:bg-slate-100
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