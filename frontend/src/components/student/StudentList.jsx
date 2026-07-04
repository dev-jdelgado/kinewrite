import StudentListItem from "./StudentListItem";

const StudentList = ({
    students,
    onEdit,
    onArchive,
}) => {
    return (
        <div className="space-y-6">
            {students.map((student) => (
                <StudentListItem
                    key={student.student_id}
                    student={student}
                    onEdit={onEdit}
                    onArchive={onArchive}
                />
            ))}
        </div>
    );
};

export default StudentList;