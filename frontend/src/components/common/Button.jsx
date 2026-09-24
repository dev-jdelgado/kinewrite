const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    disabled = false,
    icon = null,
    onClick,
}) => {

    const variants = {
        primary:
            "bg-blue-500 hover:bg-blue-600 text-white shadow-md",

        secondary:
            "bg-slate-200 hover:bg-slate-300 text-slate-700" +
            "dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100",

        success:
            "bg-green-600 hover:bg-green-700 text-white" +
            "dark:bg-green-600 dark:hover:bg-green-500",

        danger:
            "bg-red-600 hover:bg-red-700 text-white"+
            "dark:bg-red-600 dark:hover:bg-red-500",

        outline:
            "border border-orange-600 text-orange-600 hover:bg-orange-50"+
            "dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-950/50",

        ghost:
            "bg-transparent hover:bg-slate-100 text-slate-700"+
            "dark:hover:bg-slate-800 dark:text-slate-200",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`
                rounded-xl
                font-semibold
                transition-all
                duration-200
                flex
                items-center
                justify-center
                gap-2

                ${variants[variant]}
                ${sizes[size]}

                ${fullWidth ? "w-full" : ""}

                ${(disabled || loading)
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"}
            `}
        >
            {loading && (
                <span
                    className="
                        w-5
                        h-5
                        border-2
                        border-white
                        border-t-transparent
                        rounded-full
                        animate-spin
                    "
                />
            )}

            {!loading && icon}

            <span>{children}</span>
        </button>
    );
};

export default Button;