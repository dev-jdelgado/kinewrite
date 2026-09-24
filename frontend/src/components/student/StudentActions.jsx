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
                    dark:bg-blue-500
                    dark:hover:bg-blue-400
                    px-4
                    py-2
                    text-white
                    font-semibold
                    transition-all
                    duration-200
                    shadow-md
                    dark:shadow-black/30
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
                    dark:bg-red-500
                    dark:hover:bg-red-400
                    px-4
                    py-2
                    text-white
                    font-semibold
                    transition-all
                    duration-200
                    shadow-md
                    dark:shadow-black/30
                "
            >
                <Archive size={18} />
                Archive
            </button>
        </div>
    );
};

export default StudentActions;