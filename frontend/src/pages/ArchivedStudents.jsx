import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArchiveRestore, ArrowLeft, Search, Users } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import PageContainer from "../components/common/PageContainer";
import Loader from "../components/common/Loader";
import ConfirmDialog from "../components/common/ConfirmDialog";

import StudentService from "../services/StudentService";

const ArchivedStudents = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [restoreOpen, setRestoreOpen] = useState(false);
    const [studentToRestore, setStudentToRestore] = useState(null);

    const loadArchivedStudents = async () => {
        try {
            setLoading(true);
            const response = await StudentService.getArchivedStudents();
            setStudents(response?.data?.students || []);
        } catch (error) {
            console.error("Archived Students Error:", error);
            toast.error(
                error.response?.data?.message ||
                "Unable to load archived students."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArchivedStudents();
    }, []);

    const filteredStudents = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return students;

        return students.filter((student) => {
            const name = `${student.student_fname} ${student.student_lname}`.toLowerCase();
            const code = String(student.student_code || "").toLowerCase();
            return name.includes(query) || code.includes(query);
        });
    }, [students, search]);

    const openRestore = (student) => {
        setStudentToRestore(student);
        setRestoreOpen(true);
    };

    const cancelRestore = () => {
        setRestoreOpen(false);
        setStudentToRestore(null);
    };

    const confirmRestore = async () => {
        if (!studentToRestore) return;

        try {
            const response = await StudentService.restoreStudent(
                studentToRestore.student_id
            );

            toast.success(
                response?.message || "Student restored successfully."
            );

            setStudents((current) =>
                current.filter(
                    (student) =>
                        student.student_id !== studentToRestore.student_id
                )
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to restore student."
            );
        } finally {
            cancelRestore();
        }
    };

    if (loading) return <Loader />;

    return (
        <DashboardLayout>
            <DashboardHeader />

            <PageContainer className="pb-0">
                <button
                    type="button"
                    onClick={() => navigate("/students")}
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                    <ArrowLeft size={20} />
                    Back to Student Management
                </button>
            </PageContainer>

            <PageContainer className="pt-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                        <ArchiveRestore size={24} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                                            Archived Students
                                        </h1>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                            Restore previously archived student records.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative w-full md:w-80">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search students..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-sky-200"
                                />
                            </div>
                        </div>
                    </div>

                    {filteredStudents.length === 0 ? (
                        <div className="py-20 px-6 text-center">
                            <Users className="mx-auto text-slate-300" size={52} />
                            <h2 className="mt-5 text-xl font-bold text-slate-700 dark:text-white">
                                {students.length === 0
                                    ? "No Archived Students"
                                    : "No Students Found"}
                            </h2>
                            <p className="mt-2 text-slate-500">
                                {students.length === 0
                                    ? "Archived student records will appear here."
                                    : "Try a different search term."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px]">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/70 text-left text-xs uppercase tracking-wide text-slate-500">
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Student Code</th>
                                        <th className="px-6 py-4">Grade</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredStudents.map((student) => (
                                        <tr key={student.student_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-slate-800 dark:text-white">
                                                    {student.student_fname} {student.student_lname}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-slate-500 dark:text-slate-400">
                                                {student.student_code || "-"}
                                            </td>
                                            <td className="px-6 py-5 text-slate-500 dark:text-slate-400">
                                                {student.student_grade_level || "-"}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => openRestore(student)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold transition"
                                                >
                                                    <ArchiveRestore size={17} />
                                                    Restore
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </PageContainer>

            <ConfirmDialog
                open={restoreOpen}
                title="Restore Student"
                message={
                    studentToRestore
                        ? `Restore ${studentToRestore.student_fname} ${studentToRestore.student_lname}? This student will appear again in Student Management.`
                        : ""
                }
                confirmText="Restore Student"
                cancelText="Cancel"
                confirmColor="bg-sky-600 hover:bg-sky-700"
                onConfirm={confirmRestore}
                onCancel={cancelRestore}
            />
        </DashboardLayout>
    );
};

export default ArchivedStudents;
