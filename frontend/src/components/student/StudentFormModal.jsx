const StudentFormModal = ({
    open,
    onClose,
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
            "
        >
            <div
                className="
                    w-full
                    max-w-2xl
                    rounded-3xl
                    bg-white
                    p-8
                    shadow-2xl
                "
            >
                <div className="flex items-center justify-between">

                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-slate-800
                        "
                    >
                        Add Student
                    </h2>

                    <button
                        onClick={onClose}
                        className="
                            text-3xl
                            text-slate-500
                            hover:text-red-500
                        "
                    >
                        ×
                    </button>

                </div>

                <div className="mt-8">

                    <p className="text-slate-500">

                        Student registration form will be
                        implemented in the next milestone.

                    </p>

                </div>

                <div className="mt-10 flex justify-end">

                    <button
                        onClick={onClose}
                        className="
                            rounded-xl
                            bg-orange-500
                            px-6
                            py-3
                            font-semibold
                            text-white
                            hover:bg-orange-600
                        "
                    >
                        Close
                    </button>

                </div>

            </div>
        </div>
    );
};

export default StudentFormModal;