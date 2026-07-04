const EmptyStudents = ({ onCreate }) => {
    return (
        <div
            className="
                bg-white
                rounded-3xl
                shadow-md
                p-16
                text-center
            "
        >
            <div className="text-7xl">
                📚
            </div>

            <h2 className="mt-6 text-3xl font-bold text-slate-700">
                No Students Yet
            </h2>

            <p className="mt-3 text-gray-500">
                Create your first student to begin handwriting therapy.
            </p>

            <button
                onClick={onCreate}
                className="
                    mt-8
                    bg-orange-500
                    hover:bg-orange-600
                    text-white
                    px-8
                    py-3
                    rounded-xl
                    font-semibold
                "
            >
                Add Student
            </button>
        </div>
    );
};

export default EmptyStudents;