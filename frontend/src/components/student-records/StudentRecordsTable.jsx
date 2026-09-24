import StudentRecordsRow from "./StudentRecordsRow";
import StudentRecordsEmpty from "./StudentRecordsEmpty";

const StudentRecordsTable = ({
    students,
    onView,
}) => {

    if (students.length === 0) {
        return <StudentRecordsEmpty />;
    }

    return (

        <div
            className="
                overflow-hidden
                rounded-2xl
                bg-white
                dark:bg-slate-800
                shadow-lg
                dark:shadow-black/30
                border
                border-slate-200
                dark:border-slate-700
                transition-colors
                duration-300
            "
        >
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead
                        className="
                            bg-slate-100
                            dark:bg-slate-700
                            text-slate-700
                            dark:text-slate-200
                        "
                    >
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold">
                                Student Code
                            </th>
                            <th className="px-6 py-4 text-left font-semibold">
                                Student
                            </th>
                            <th className="px-6 py-4 text-left font-semibold">
                                Grade
                            </th>
                            <th className="px-6 py-4 text-left font-semibold">
                                Current Level
                            </th>
                            <th className="px-6 py-4 text-left font-semibold">
                                Classification
                            </th>
                            <th className="px-6 py-4 text-left font-semibold">
                                Assessment
                            </th>
                            <th className="px-6 py-4 text-left font-semibold">
                                Last Activity
                            </th>
                            <th className="px-6 py-4 text-center font-semibold">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student) => (

                            <StudentRecordsRow
                                key={student.student_id}
                                student={student}
                                onView={onView}
                            />

                        ))}
                    </tbody>
                </table>
            </div>

            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-t
                    border-slate-200
                    dark:border-slate-700
                    bg-slate-50
                    dark:bg-slate-700
                    px-6
                    py-4
                    transition-colors
                    duration-300
                "
            >

                <p className="text-sm text-slate-500 dark:text-slate-300">
                    Showing{" "}
                    <span className="font-semibold text-slate-700 dark:text-white">
                        {students.length}
                    </span>{" "}
                    student{students.length !== 1 && "s"}
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-300">
                    KineWrite Student Records

                </p>
            </div>
        </div>
    );
};

export default StudentRecordsTable;