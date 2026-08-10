const SvgGuide = ({ children }) => {
    return (
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full"
        >
            {children}
        </svg>
    );
};

export default SvgGuide;