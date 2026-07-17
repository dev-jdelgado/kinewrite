import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = ({
    to = "/dashboard",
    label = "Back to Dashboard",
    className = "",
}) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(to)}
            className={`
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-white
                px-5
                py-3
                text-[#000000]
                font-semibold
                shadow-md
                border
                border-blue-200
                hover:bg-blue-100   
                hover:shadow-lg
                transition-all
                duration-200
                ${className}
            `}
        >
            <ArrowLeft size={20} />
            {label}
        </button>
    );
};

export default BackButton;