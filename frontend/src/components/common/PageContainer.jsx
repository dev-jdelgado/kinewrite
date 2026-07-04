const PageContainer = ({
    children,
    className = "",
    maxWidth = "7xl",
    paddingX = "10",
    paddingY = "16",
}) => {

    const width = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
        full: "max-w-full",
    };

    const px = {
        0: "px-0",
        4: "px-4",
        6: "px-6",
        8: "px-8",
        10: "px-10",
        12: "px-12",
    };

    const py = {
        0: "py-0",
        4: "py-4",
        6: "py-6",
        8: "py-8",
        10: "py-10",
        12: "py-12",
        16: "py-16",
    };

    return (
        <div
            className={`
                ${width[maxWidth]}
                mx-auto
                ${px[paddingX]}
                ${py[paddingY]}
                ${className}
            `}
        >
            {children}
        </div>
    );
};

export default PageContainer;