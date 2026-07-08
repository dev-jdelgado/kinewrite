const StudentRecordsEmpty = () => {
    return (
        <div
            className="
                rounded-2xl
                border-2
                border-dashed
                border-slate-300
                bg-white
                py-24
                text-center
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
                "
            >
                No Student Records Found
            </h2>

            <p
                className="
                    mt-4
                    text-slate-500
                "
            >
                No students match your current search.
            </p>
        </div>
    );
};

export default StudentRecordsEmpty;