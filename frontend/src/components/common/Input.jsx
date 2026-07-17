const Input = ({
    label,
    name,
    type = "text",
    placeholder = "",
    value,
    onChange,
    error = "",
    required = false,
    disabled = false,
    icon = null,
    rightIcon = null,
}) => {

    return (
        <div className="w-full">

            {label && (

                <label
                    className="
                        block
                        mb-2
                        text-sm
                        font-semibold
                        text-slate-700
                    "
                >
                    {label}

                    {required && (
                        <span className="text-red-500 ml-1">
                            *
                        </span>
                    )}

                </label>

            )}

            <div className="relative">

                {icon && (
                    <div
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                        "
                    >
                        {icon}
                    </div>
                )}

                <input
                    name={name}
                    type={type}
                    value={value}
                    disabled={disabled}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={`
                        w-full
                        rounded-xl
                        border
                        bg-white
                        px-4
                        py-3
                        text-slate-700
                        outline-none
                        transition-all
                        duration-200

                        ${icon ? "pl-12" : ""}
                        ${rightIcon ? "pr-12" : ""}

                        ${
                            error
                                ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                : "border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        }

                        ${
                            disabled
                                ? "bg-slate-100 cursor-not-allowed"
                                : ""
                        }
                    `}
                />
                {rightIcon && (
                    <div
                        className="
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                            cursor-pointer
                        "
                    >
                        {rightIcon}
                    </div>
                )}

            </div>

            {error && (

                <p className="mt-2 text-sm text-red-500">
                    {error}
                </p>

            )}

        </div>
    );
};

export default Input;