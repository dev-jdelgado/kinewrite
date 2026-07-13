import {
    CalendarDays,
    Clock3,
    Eye,
} from "lucide-react";

const RecentSessionsTable = ({
    sessions = [],
    onViewSession,
}) => {

    return (

        <div
            className="
                bg-white
                rounded-3xl
                shadow-lg
                p-8
                mb-8
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    mb-8
                "
            >
                <div>
                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-slate-800
                        "
                    >
                        Recent Therapy Sessions
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Review previous handwriting therapy sessions.
                    </p>
                </div>
            </div>

            {
                sessions.length === 0
                    ?
                    (
                        <div
                            className="
                                py-16
                                text-center
                                border-2
                                border-dashed
                                border-slate-200
                                rounded-2xl
                            "
                        >
                            <div className="text-6xl mb-4">
                                📖
                            </div>
                            <h3
                                className="
                                    text-2xl
                                    font-bold
                                    text-slate-700
                                "
                            >
                                No Therapy Sessions Yet
                            </h3>
                            <p
                                className="
                                    mt-3
                                    text-slate-500
                                "
                            >
                                Therapy sessions will appear here after the
                                student completes handwriting exercises.
                            </p>
                        </div>
                    )
                    :
                    (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead
                                    className="
                                        bg-slate-100
                                        text-slate-700
                                    "
                                >

                                    <tr>
                                        <th className="px-6 py-4 text-left">
                                            Session
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Duration
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Accuracy
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Stars
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        sessions.map((session) => (
                                            <tr
                                                key={session.session_id}
                                                className="
                                                    border-b
                                                    hover:bg-orange-50
                                                    transition-colors
                                                "
                                            >
                                                <td className="px-6 py-5 font-semibold">
                                                    #{session.session_number}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays size={16} />
                                                        {
                                                            new Date(
                                                                session.session_date
                                                            ).toLocaleDateString()
                                                        }
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <Clock3 size={16} />
                                                        {session.duration} mins
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    {session.average_accuracy}%
                                                </td>

                                                <td className="px-6 py-5">
                                                    ⭐ {session.total_stars}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span
                                                        className="
                                                            px-3
                                                            py-1
                                                            rounded-full
                                                            bg-green-100
                                                            text-green-700
                                                            text-sm
                                                            font-medium
                                                        "
                                                    >
                                                        Completed
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5 text-center">
                                                    <button
                                                        onClick={() =>
                                                            onViewSession &&
                                                            onViewSession(session)
                                                        }
                                                        className="
                                                            p-3
                                                            rounded-xl
                                                            bg-[#9b4c00]
                                                            text-white
                                                            hover:bg-[#7a3b00]
                                                            transition-all
                                                        "
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    )
            }
        </div>
    );
};

export default RecentSessionsTable;