const PageHeader = ({
    title,
    subtitle = "",
    action = null,
    align = "left",
}) => {
    const alignment = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };

    return (
        <div className="mb-8">
            <div
                className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${alignment[align]}`}
            >
                <div className="w-full">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="mt-2 text-slate-500 text-base md:text-lg">
                            {subtitle}
                        </p>
                    )}
                </div>

                {action && (
                    <div className="flex justify-center md:justify-end">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;