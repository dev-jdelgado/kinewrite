const EmptyStudents = ({ onCreate }) => {
    return (
        <div
            className="
                bg-white
                dark:bg-slate-800
                rounded-3xl
                shadow-md
                dark:shadow-black/30
                p-16
                text-center
                transition-colors
                duration-300
            "
        >
            <div className="text-7xl">
                📚
            </div>

            <h2 className="mt-6 text-3xl font-bold text-slate-700 dark:text-white">
                No Students Yet
            </h2>

            <p className="mt-3 text-gray-500 dark:text-slate-300">
                Create your first student to begin handwriting therapy.
            </p>

            <button
                onClick={onCreate}
                className="
                    mt-8
                    bg-orange-500
                    hover:bg-orange-600
                    dark:bg-orange-500
                    dark:hover:bg-orange-400
                    text-white
                    px-8
                    py-3
                    rounded-xl
                    font-semibold
                    transition-all
                    duration-200
                "
            >
                Add Student
            </button>
        </div>
    );
};

export default EmptyStudents;