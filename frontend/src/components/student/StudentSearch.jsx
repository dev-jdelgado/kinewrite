import { Search } from "lucide-react";

const StudentSearch = ({
    value,
    onChange,
    placeholder = "Search student...",
}) => {
    return (
        <div
            className="
                relative
                w-full
                md:w-96
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
                    dark:text-slate-500
                "
            />

            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    dark:border-slate-600
                    bg-white
                    dark:bg-slate-800
                    py-3
                    pl-12
                    pr-4
                    text-slate-700
                    dark:text-white
                    placeholder:text-slate-400
                    dark:placeholder:text-slate-500
                    shadow-sm
                    dark:shadow-black/20
                    outline-none
                    transition-all
                    duration-200
                    focus:border-orange-500
                    dark:focus:border-orange-400
                    focus:ring-2
                    focus:ring-orange-200
                    dark:focus:ring-orange-900
                "
            />
        </div>
    );
};

export default StudentSearch;