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
                shadow-lg
                border
                border-slate-200
            "
        >
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead
                        className="
                            bg-slate-100
                            text-slate-700
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
                    bg-slate-50
                    px-6
                    py-4
                "
            >

                <p className="text-sm text-slate-500">
                    Showing{" "}
                    <span className="font-semibold">
                        {students.length}
                    </span>{" "}
                    student{students.length !== 1 && "s"}
                </p>

                <p className="text-sm text-slate-500">
                    KineWrite Student Records

                </p>
            </div>
        </div>
    );
};

export default StudentRecordsTable;