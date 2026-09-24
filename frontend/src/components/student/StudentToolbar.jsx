import StudentSearch from "./StudentSearch";

const StudentToolbar = ({
    search,
    setSearch,
    onAddStudent,
}) => {
    return (
        <div
            className="
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-6
                mb-8
            "
        >
            <div>
                <h1
                    className="
                        text-4xl
                        font-bold
                        text-black
                        dark:text-white
                    "
                >
                    Student Management
                </h1>

                <p
                    className="
                        text-black
                        dark:text-white
                        mt-2
                    "
                >
                    Manage student records and handwriting therapy profiles.
                </p>
            </div>

            <div
                className="
                    flex
                    flex-col
                    md:flex-row
                    gap-4
                    items-stretch
                "
            >
                <StudentSearch
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <button
                    onClick={onAddStudent}
                    className="
                        px-8
                        py-3
                        rounded-xl
                        bg-blue-500
                        hover:bg-blue-600
                        dark:bg-blue-500
                        dark:hover:bg-blue-400
                        text-white
                        font-semibold
                        shadow-lg
                        dark:shadow-black/30
                        transition-all
                        duration-200
                        whitespace-nowrap
                    "
                >
                    + Add Student
                </button>
            </div>
        </div>
    );
};

export default StudentToolbar;