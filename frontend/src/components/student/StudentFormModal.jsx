import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useStudents } from "../../contexts/StudentContext";

const initialState = {
    student_fname: "",
    student_lname: "",
    student_gender: "Male",
    student_bday: "",
    student_grade_level: "",
    student_notes: "",
};

const StudentFormModal = ({
    open,
    onClose,
    student,
}) => {
    const { createStudent, updateStudent } = useStudents();

    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (student) {
            setFormData({
                student_fname: student.student_fname || "",
                student_lname: student.student_lname || "",
                student_gender: student.student_gender || "Male",
                student_bday: student.student_bday || "",
                student_grade_level: student.student_grade_level || "",
                student_notes: student.student_notes || "",
            });
        } else {
            setFormData(initialState);
        }
    }, [student, open]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.student_fname.trim()) {
            toast.error("First name is required.");
            return;
        }

        if (!formData.student_lname.trim()) {
            toast.error("Last name is required.");
            return;
        }

        if (!formData.student_gender) {
            toast.error("Please select a gender.");
            return;
        }

        if (!formData.student_bday) {
            toast.error("Please select the student's birthday.");
            return;
        }

        if (!formData.student_grade_level) {
            toast.error("Please select a grade level.");
            return;
        }

        setLoading(true);

        let success = false;

        if (student) {
            success = await updateStudent(
                student.student_id,
                formData
            );
        } else {
            success = await createStudent(formData);
        }

        setLoading(false);

        if (success) {
            setFormData(initialState);
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                bg-black/50
                flex
                items-center
                justify-center
                p-4
                sm:p-6
            "
        >
            <div
                className="
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    w-full
                    max-w-4xl
                    max-h-[90vh]
                    flex
                    flex-col
                "
            >
                {/* Header */}
                <div
                    className="
                        flex
                        justify-between
                        items-center
                        px-6
                        sm:px-8
                        py-6
                        border-b
                        shrink-0
                    "
                >
                    <div>
                        <h2
                            className="
                                text-2xl
                                sm:text-3xl
                                font-bold
                                text-black
                            "
                        >
                            {student ? "Edit Student" : "Add Student"}
                        </h2>

                        <p className="text-slate-500 mt-1 text-sm sm:text-base">
                            Enter the student's information below.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="
                            p-2
                            rounded-xl
                            hover:bg-slate-100
                            transition
                        "
                    >
                        <X size={28} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="
                        flex
                        flex-col
                        flex-1
                        overflow-hidden
                    "
                >
                    {/* Scrollable Body */}
                    <div
                        className="
                            flex-1
                            overflow-y-auto
                            p-6
                            sm:p-8
                        "
                    >
                        <div className="flex justify-center mb-8">
                            <div
                                className="
                                    w-28
                                    h-28
                                    rounded-full
                                    bg-orange-100
                                    flex
                                    items-center
                                    justify-center
                                    text-6xl
                                "
                            >
                                {formData.student_gender === "Male"
                                    ? "👦"
                                    : "👧"}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="font-medium mb-2 block">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="student_fname"
                                    value={formData.student_fname}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="
                                        w-full
                                        border
                                        rounded-xl
                                        px-4
                                        py-3
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-400
                                    "
                                />
                            </div>

                            <div>
                                <label className="font-medium mb-2 block">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="student_lname"
                                    value={formData.student_lname}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="
                                        w-full
                                        border
                                        rounded-xl
                                        px-4
                                        py-3
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-400
                                    "
                                />
                            </div>

                            <div>
                                <label className="font-medium mb-2 block">
                                    Gender
                                </label>

                                <select
                                    name="student_gender"
                                    value={formData.student_gender}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="
                                        w-full
                                        border
                                        rounded-xl
                                        px-4
                                        py-3
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-400
                                    "
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-medium mb-2 block">
                                    Birthday
                                </label>

                                <input
                                    type="date"
                                    name="student_bday"
                                    value={formData.student_bday}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="
                                        w-full
                                        border
                                        rounded-xl
                                        px-4
                                        py-3
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-400
                                    "
                                />
                            </div>

                            <div>
                                <label className="font-medium mb-2 block">
                                    Grade Level
                                </label>

                                <select
                                    name="student_grade_level"
                                    value={formData.student_grade_level}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="
                                        w-full
                                        border
                                        rounded-xl
                                        px-4
                                        py-3
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-400
                                    "
                                >
                                    <option value="">
                                        Select Grade
                                    </option>

                                    {[1, 2, 3, 4, 5, 6].map((grade) => (
                                        <option
                                            key={grade}
                                            value={grade}
                                        >
                                            Grade {grade}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="font-medium mb-2 block">
                                Notes
                            </label>

                            <textarea
                                rows={5}
                                name="student_notes"
                                value={formData.student_notes}
                                onChange={handleChange}
                                disabled={loading}
                                className="
                                    w-full
                                    border
                                    rounded-xl
                                    px-4
                                    py-3
                                    resize-none
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-400
                                "
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className="
                            border-t
                            px-6
                            sm:px-8
                            py-6
                            flex
                            flex-col
                            sm:flex-row
                            justify-end
                            gap-4
                            shrink-0
                        "
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="
                                w-full
                                sm:w-auto
                                px-8
                                py-3
                                rounded-xl
                                border
                                font-semibold
                                hover:bg-slate-100
                                transition
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                sm:w-auto
                                px-8
                                py-3
                                rounded-xl
                                bg-blue-300
                                text-black
                                font-semibold
                                hover:bg-blue-400
                                border
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                                transition-all
                            "
                        >
                            {loading
                                ? "Saving..."
                                : student
                                ? "Update Student"
                                : "Create Student"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentFormModal;