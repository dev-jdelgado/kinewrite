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
                 dark:bg-slate-800
                px-5
                py-3
                text-[#000000]
                dark:text-white
                font-semibold
                shadow-md
                dark:shadow-black/30
                border
                border-blue-200
                dark:border-blue-800
                hover:bg-blue-100   
                dark:hover:bg-slate-700
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