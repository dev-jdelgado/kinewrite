const Loader = ({
    text = "Loading...",
    fullScreen = true,
}) => {

    const containerClass = fullScreen
        ? "min-h-screen"
        : "h-full min-h-[200px]";

    return (
        <div
            className={`${containerClass} flex flex-col items-center justify-center bg-slate-50`}
        >
            {/* Spinner */}
            <div className="relative w-16 h-16">

                <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>

                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>

            </div>

            {/* Text */}

            <p className="mt-5 text-slate-600 text-lg font-medium">
                {text}
            </p>

        </div>
    );
};

export default Loader;