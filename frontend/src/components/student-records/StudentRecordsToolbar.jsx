import { Search } from "lucide-react";

const StudentRecordsToolbar = ({
    search,
    setSearch,
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
                    Student Records
                </h1>

                <p
                    className="
                        text-black
                        dark:text-white
                        mt-2
                    "
                >
                    Review student progress, assessments, therapy sessions and generate progress reports.
                </p>
            </div>

            <div
                className="
                    relative
                    w-full
                    lg:w-96
                "
            >
                <Search
                    size={20}
                    className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                    "
                />

                <input
                    type="text"
                    placeholder="Search student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        py-3
                        pl-12
                        pr-4
                        outline-none
                        transition-all
                        focus:border-orange-400
                        focus:ring-2
                        focus:ring-orange-200
                    "
                />
            </div>
        </div>
    );
};

export default StudentRecordsToolbar;