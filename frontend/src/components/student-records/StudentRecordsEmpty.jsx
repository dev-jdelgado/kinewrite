const StudentRecordsEmpty = () => {
    return (
        <div
            className="
                rounded-2xl
                border-2
                border-dashed
                border-slate-300
                dark:border-slate-600
                bg-white
                dark:bg-slate-800
                py-24
                text-center
                transition-colors
                duration-300
            "
        >
            <div className="text-7xl mb-6">
                📋
            </div>

            <h2
                className="
                    text-3xl
                    font-bold
                    text-slate-800
                    dark:text-white
                "
            >
                No Student Records Found
            </h2>

            <p
                className="
                    mt-4
                    text-slate-500
                    dark:text-slate-400
                "
            >
                No students match your current search.
            </p>
        </div>
    );
};

export default StudentRecordsEmpty;