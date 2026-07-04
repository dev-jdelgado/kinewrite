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
                    bg-white
                    py-3
                    pl-12
                    pr-4
                    text-slate-700
                    shadow-sm
                    outline-none
                    transition
                    focus:border-orange-500
                    focus:ring-2
                    focus:ring-orange-200
                "
            />
        </div>
    );
};

export default StudentSearch;