import { Pencil, Archive } from "lucide-react";

const StudentActions = ({
    student,
    onEdit,
    onArchive,
}) => {
    return (
        <div
            className="
                flex
                gap-3
                flex-wrap
                justify-center
            "
        >
            <button
                onClick={() => onEdit?.(student)}
                className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-blue-500
                    hover:bg-blue-600
                    px-4
                    py-2
                    text-white
                    font-semibold
                    transition-all
                    shadow-md
                "
            >
                <Pencil size={18} />
                Edit
            </button>

            <button
                onClick={() => onArchive?.(student)}
                className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-red-500
                    hover:bg-red-600
                    px-4
                    py-2
                    text-white
                    font-semibold
                    transition-all
                    shadow-md
                "
            >
                <Archive size={18} />
                Archive
            </button>
        </div>
    );
};

export default StudentActions;