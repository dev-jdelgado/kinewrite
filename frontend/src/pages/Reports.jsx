import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    BarChart3,
    CalendarDays,
    Printer,
    Star,
    Target,
    Trophy,
} from "lucide-react";
import toast from "react-hot-toast";

import StudentService from "../services/StudentService";
import ExerciseService from "../services/ExerciseService";
import AssessmentService from "../services/AssessmentService";

const parseStrokeData = (value) => {
    try {
        return typeof value === "string"
            ? JSON.parse(value)
            : value || {};
    } catch {
        return {};
    }
};

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "-"
        : date.toLocaleDateString();
};

const scoreClass = (score) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 75) return "text-sky-600";
    if (score >= 60) return "text-amber-600";

    return "text-rose-600";
};

const Reports = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);

    const [exerciseData, setExerciseData] = useState({
        sessions: [],
        attempts: [],
    });

    const [assessments, setAssessments] = useState([]);

    const [loading, setLoading] = useState(true);

    // =========================================================
    // LOAD REPORT DATA
    // =========================================================

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setLoading(true);

                const [
                    studentResponse,
                    exerciseResponse,
                    assessmentResponse,
                ] = await Promise.all([
                    StudentService.getStudent(studentId),
                    ExerciseService.getStudentHistory(studentId),
                    AssessmentService.getStudentAssessments(studentId),
                ]);

                if (!mounted) return;

                // -------------------------------------------------
                // Student
                // -------------------------------------------------

                setStudent(
                    studentResponse?.data?.student || null
                );

                // -------------------------------------------------
                // Exercise history
                // -------------------------------------------------

                setExerciseData(
                    exerciseResponse?.data || {
                        sessions: [],
                        attempts: [],
                    }
                );

                // -------------------------------------------------
                // Assessments
                // -------------------------------------------------

                const assessmentPayload =
                    assessmentResponse?.data;

                const assessmentRows =
                    Array.isArray(assessmentPayload)
                        ? assessmentPayload
                        : Array.isArray(
                              assessmentPayload?.assessments
                          )
                            ? assessmentPayload.assessments
                            : assessmentPayload?.assessment
                                ? [assessmentPayload.assessment]
                                : [];

                setAssessments(assessmentRows);
            } catch (error) {
                console.error(
                    "Report load error:",
                    error
                );

                toast.error(
                    "Unable to load the student report."
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, [studentId]);

    // =========================================================
    // PARSED ATTEMPTS
    // =========================================================

    const attempts = useMemo(() => {
        return (exerciseData.attempts || []).map(
            (attempt) => ({
                ...attempt,
                meta: parseStrokeData(
                    attempt.stroke_data
                ),
            })
        );
    }, [exerciseData.attempts]);

    // =========================================================
    // GROUP ITEM ATTEMPTS INTO ACTIVITIES
    // =========================================================

    const activityResults = useMemo(() => {
        const groups = new Map();

        attempts.forEach((attempt) => {
            const meta = attempt.meta || {};

            const activityId =
                meta.activityId ||
                meta.activity_id ||
                attempt.exercise_id ||
                `attempt-${attempt.attempt_id}`;

            const key = String(activityId);

            if (!groups.has(key)) {
                groups.set(key, {
                    activityId: key,

                    title:
                        meta.activityTitle ||
                        meta.activity_title ||
                        "Handwriting Activity",

                    category:
                        String(
                            meta.category || ""
                        ).toLowerCase() || "-",

                    mode: meta.mode || "",

                    attempts: [],
                });
            }

            groups
                .get(key)
                .attempts.push(attempt);
        });

        return [...groups.values()].map(
            (activity) => {
                const rows =
                    activity.attempts;

                // -------------------------------------------------
                // Activity score = average of item scores
                // -------------------------------------------------

                const score = rows.length
                    ? rows.reduce(
                          (sum, row) =>
                              sum +
                              Number(
                                  row.accuracy || 0
                              ),
                          0
                      ) / rows.length
                    : 0;

                // -------------------------------------------------
                // Stars
                // -------------------------------------------------

                const stars = rows.length
                    ? Math.round(
                          rows.reduce(
                              (sum, row) =>
                                  sum +
                                  Number(
                                      row.stars || 0
                                  ),
                              0
                          ) / rows.length
                      )
                    : 0;

                // -------------------------------------------------
                // Total time
                // -------------------------------------------------

                const completionTime =
                    rows.reduce(
                        (sum, row) =>
                            sum +
                            Number(
                                row.completion_time ||
                                    0
                            ),
                        0
                    );

                // -------------------------------------------------
                // Total strokes
                // -------------------------------------------------

                const strokeCount =
                    rows.reduce(
                        (sum, row) =>
                            sum +
                            Number(
                                row.stroke_count ||
                                    0
                            ),
                        0
                    );

                return {
                    ...activity,

                    score: Math.max(
                        0,
                        Math.min(100, score)
                    ),

                    stars: Math.max(
                        0,
                        Math.min(3, stars)
                    ),

                    itemCount: rows.length,

                    completionTime,

                    strokeCount,

                    firstAttemptId:
                        rows[0]?.attempt_id ||
                        null,
                };
            }
        );
    }, [attempts]);

    // =========================================================
    // FIND THE CORRECT COMPLETED PRE-ASSESSMENT
    // =========================================================

    const latestAssessment = useMemo(() => {
        if (!assessments.length) {
            return null;
        }

        const preAssessments =
            assessments
                .filter((assessment) => {
                    const type = String(
                        assessment.assessment_type ||
                        assessment.assessmentType ||
                        ""
                    ).toLowerCase();

                    return (
                        type.includes("pre") ||
                        type.includes("pre-test") ||
                        type.includes("pre test")
                    );
                })
                .map((assessment) => {
                    const overall =
                        Number(
                            assessment.overall_score ??
                            assessment.overallScore ??
                            0
                        );

                    const spacing =
                        Number(
                            assessment.spacing_score ??
                            assessment.spacingScore ??
                            0
                        );

                    const alignment =
                        Number(
                            assessment.alignment_score ??
                            assessment.alignmentScore ??
                            0
                        );

                    const stroke =
                        Number(
                            assessment.stroke_score ??
                            assessment.strokeScore ??
                            0
                        );

                    return {
                        ...assessment,

                        _overall: overall,
                        _spacing: spacing,
                        _alignment: alignment,
                        _stroke: stroke,
                    };
                });

        /*
         * Only use a scored pre-assessment.
         *
         * This prevents a newer empty Pre-Test
         * from replacing the actual analyzed result.
         */

        const scoredPreAssessments =
            preAssessments.filter(
                (assessment) =>
                    assessment._overall > 0 ||
                    assessment._spacing > 0 ||
                    assessment._alignment > 0 ||
                    assessment._stroke > 0
            );

        const candidates =
            scoredPreAssessments.length
                ? scoredPreAssessments
                : preAssessments;

        return (
            [...candidates].sort(
                (a, b) =>
                    new Date(
                        b.assessment_date ||
                        b.created_at ||
                        b.updated_at ||
                        0
                    ) -
                    new Date(
                        a.assessment_date ||
                        a.created_at ||
                        a.updated_at ||
                        0
                    )
            )[0] || null
        );
    }, [assessments]);

    // =========================================================
    // ASSESSMENT VALUE HELPER
    // =========================================================

    const getAssessmentValue = (
        assessment,
        ...keys
    ) => {
        if (!assessment) {
            return 0;
        }

        for (const key of keys) {
            const value =
                assessment[key];

            if (
                value !== null &&
                value !== undefined &&
                value !== ""
            ) {
                return value;
            }
        }

        return 0;
    };

    // =========================================================
    // ACTIVITY CATEGORY STATISTICS
    // =========================================================

    const activityStats = useMemo(() => {
        return [
            "spacing",
            "alignment",
            "stroke",
        ].map((category) => {
            const rows =
                activityResults.filter(
                    (activity) =>
                        String(
                            activity.category ||
                                ""
                        ).toLowerCase() ===
                        category
                );

            const score = rows.length
                ? rows.reduce(
                      (sum, activity) =>
                          sum +
                          Number(
                              activity.score ||
                                  0
                          ),
                      0
                  ) / rows.length
                : 0;

            return {
                category,
                count: rows.length,
                score,
            };
        });
    }, [activityResults]);

    // =========================================================
    // OVERALL ACTIVITY SCORE
    // =========================================================

    const overallActivityScore =
        activityResults.length
            ? activityResults.reduce(
                  (sum, activity) =>
                      sum +
                      Number(
                          activity.score || 0
                      ),
                  0
              ) / activityResults.length
            : 0;

    // =========================================================
    // TOTAL STARS
    // =========================================================

    const totalStars =
        activityResults.reduce(
            (sum, activity) =>
                sum +
                Number(
                    activity.stars || 0
                ),
            0
        );

    // =========================================================
    // PRE-ASSESSMENT SCORES
    // =========================================================

    const preAssessmentScore =
        Number(
            latestAssessment?._overall ??
            getAssessmentValue(
                latestAssessment,
                "overall_score",
                "overallScore"
            )
        );

    const preSpacingScore =
        Number(
            latestAssessment?._spacing ??
            getAssessmentValue(
                latestAssessment,
                "spacing_score",
                "spacingScore"
            )
        );

    const preAlignmentScore =
        Number(
            latestAssessment?._alignment ??
            getAssessmentValue(
                latestAssessment,
                "alignment_score",
                "alignmentScore"
            )
        );

    const preStrokeScore =
        Number(
            latestAssessment?._stroke ??
            getAssessmentValue(
                latestAssessment,
                "stroke_score",
                "strokeScore"
            )
        );

    // =========================================================
    // IMPROVEMENT
    // =========================================================

    const improvement =
        attempts.length &&
        latestAssessment
            ? overallActivityScore -
              preAssessmentScore
            : null;

    // =========================================================
    // COMPLETED SESSIONS
    // =========================================================

    const completedSessions = useMemo(() => {
        return (
            exerciseData.sessions || []
        ).filter(
            (session) =>
                Number(
                    session.completed
                ) === 1
        );
    }, [exerciseData.sessions]);

    // =========================================================
    // LATEST COMPLETED SESSION
    // =========================================================

    const latestSession = useMemo(() => {
        return (
            [...completedSessions].sort(
                (a, b) =>
                    new Date(
                        b.session_date ||
                        b.created_at ||
                        0
                    ) -
                    new Date(
                        a.session_date ||
                        a.created_at ||
                        0
                    )
            )[0] || null
        );
    }, [completedSessions]);

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-xl font-black text-slate-700">
                    Loading report...
                </div>
            </div>
        );
    }

    // =========================================================
    // STUDENT NOT FOUND
    // =========================================================

    if (!student) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 gap-5">
                <h1 className="text-3xl font-black text-slate-800">
                    Student Not Found
                </h1>

                <button
                    onClick={() =>
                        navigate(
                            "/student-records"
                        )
                    }
                    className="px-5 py-3 rounded-xl bg-sky-500 text-white font-bold"
                >
                    Back to Student Records
                </button>
            </div>
        );
    }

    // =========================================================
    // REPORT
    // =========================================================

    return (
        <>
            <div className="min-h-screen bg-slate-100 py-8 px-5 print:bg-white print:py-0">

                <div className="max-w-6xl mx-auto">

                    {/* =========================================
                        SCREEN CONTROLS
                    ========================================= */}

                    <div className="flex items-center justify-between mb-6 print-hidden">

                        <button
                            onClick={() =>
                                navigate(
                                    `/student-records/${studentId}`
                                )
                            }
                            className="flex items-center gap-2 font-black text-slate-600"
                        >
                            <ArrowLeft
                                size={20}
                            />

                            Back to Student Progress
                        </button>

                        <button
                            onClick={() =>
                                window.print()
                            }
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#9b4c00] text-white font-black shadow-lg"
                        >
                            <Printer
                                size={18}
                            />

                            Generate PDF Report
                        </button>

                    </div>

                    {/* =========================================
                        REPORT CONTAINER
                    ========================================= */}

                    <div className="bg-white rounded-[32px] shadow-xl overflow-hidden print:shadow-none print:rounded-none print-report">

                        {/* =====================================
                            HEADER
                        ===================================== */}

                        <div className="p-8 md:p-12 border-b-4 border-sky-100">

                            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

                                <div>

                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-500">
                                        KineWrite
                                    </p>

                                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 mt-2">
                                        Handwriting Progress Report
                                    </h1>

                                    <p className="text-slate-500 mt-3">
                                        Assessment and handwriting activity performance summary
                                    </p>

                                </div>

                                <div className="text-left md:text-right text-sm text-slate-500">

                                    <div className="font-bold text-slate-700">
                                        Report Date
                                    </div>

                                    <div>
                                        {formatDate(
                                            new Date()
                                        )}
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* =====================================
                            STUDENT PROFILE
                        ===================================== */}

                        <section className="p-8 md:p-12 print-section">

                            <div className="flex flex-col md:flex-row md:items-center gap-6">

                                <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-5xl shrink-0">
                                    {student.student_gender ===
                                    "Female"
                                        ? "👧"
                                        : "👦"}
                                </div>

                                <div className="flex-1">

                                    <h2 className="text-3xl font-black text-slate-800">
                                        {
                                            student.student_fname
                                        }{" "}
                                        {
                                            student.student_lname
                                        }
                                    </h2>

                                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-slate-500">

                                        <span>
                                            Student Code:{" "}
                                            {
                                                student.student_code ||
                                                student.student_id
                                            }
                                        </span>

                                        <span>
                                            Grade:{" "}
                                            {
                                                student.student_grade_level ||
                                                "-"
                                            }
                                        </span>

                                        <span>
                                            Gender:{" "}
                                            {
                                                student.student_gender ||
                                                "-"
                                            }
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </section>

                        {/* =====================================
                            PRE-ASSESSMENT
                        ===================================== */}

                        <section className="px-8 md:px-12 pb-10 print-section">

                            <div className="flex items-center gap-3 mb-5">

                                <Target className="text-sky-500" />

                                <h2 className="text-2xl font-black text-slate-800">
                                    Pre-Assessment Results
                                </h2>

                            </div>

                            {latestAssessment ? (
                                <>

                                    {/* PRINT-FIXED 5 COLUMN GRID */}

                                    <div className="grid md:grid-cols-5 gap-4 print-grid-5">

                                        <ReportMetric
                                            label="Overall"
                                            value={`${preAssessmentScore.toFixed(
                                                1
                                            )}%`}
                                            highlight
                                        />

                                        <ReportMetric
                                            label="Spacing"
                                            value={`${preSpacingScore.toFixed(
                                                1
                                            )}%`}
                                        />

                                        <ReportMetric
                                            label="Alignment"
                                            value={`${preAlignmentScore.toFixed(
                                                1
                                            )}%`}
                                        />

                                        <ReportMetric
                                            label="Stroke"
                                            value={`${preStrokeScore.toFixed(
                                                1
                                            )}%`}
                                        />

                                        <ReportMetric
                                            label="Classification"
                                            value={
                                                getAssessmentValue(
                                                    latestAssessment,
                                                    "classification",
                                                    "assessment_classification"
                                                ) ||
                                                "-"
                                            }
                                            small
                                        />

                                    </div>

                                    <div className="mt-4 rounded-2xl bg-slate-50 p-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">

                                        <span>
                                            <strong>
                                                Recommended Level:
                                            </strong>{" "}
                                            {getAssessmentValue(
                                                latestAssessment,
                                                "recommended_level",
                                                "recommendedLevel",
                                                "therapyLevel",
                                                "therapy_level"
                                            ) || "-"}
                                        </span>

                                        <span>
                                            <strong>
                                                Date:
                                            </strong>{" "}
                                            {formatDate(
                                                latestAssessment.assessment_date ||
                                                    latestAssessment.assessmentDate ||
                                                    latestAssessment.created_at ||
                                                    latestAssessment.createdAt
                                            )}
                                        </span>

                                        {getAssessmentValue(
                                            latestAssessment,
                                            "remarks",
                                            "assessment_remarks"
                                        ) && (
                                            <span className="basis-full">
                                                <strong>
                                                    Remarks:
                                                </strong>{" "}
                                                {getAssessmentValue(
                                                    latestAssessment,
                                                    "remarks",
                                                    "assessment_remarks"
                                                )}
                                            </span>
                                        )}

                                    </div>

                                </>
                            ) : (
                                <EmptyState text="No completed pre-assessment is available yet." />
                            )}

                        </section>

                        {/* =====================================
                            ACTIVITY PERFORMANCE
                        ===================================== */}

                        <section className="px-8 md:px-12 py-10 bg-slate-50 print:bg-white border-y border-slate-200 print-section">

                            <div className="flex items-center gap-3 mb-5">

                                <BarChart3 className="text-[#9b4c00]" />

                                <h2 className="text-2xl font-black text-slate-800">
                                    Handwriting Activity Performance
                                </h2>

                            </div>

                            {/* PRINT-FIXED 4 COLUMN GRID */}

                            <div className="grid md:grid-cols-4 gap-4 mb-6 print-grid-4">

                                <ReportMetric
                                    label="Overall Activity Score"
                                    value={`${overallActivityScore.toFixed(
                                        1
                                    )}%`}
                                    highlight
                                />

                                <ReportMetric
                                    label="Activities Completed"
                                    value={
                                        activityResults.length
                                    }
                                />

                                <ReportMetric
                                    label="Stars Earned"
                                    value={
                                        totalStars
                                    }
                                />

                                <ReportMetric
                                    label="Sessions"
                                    value={
                                        completedSessions.length
                                    }
                                />

                            </div>

                            {/* PRINT-FIXED 3 COLUMN GRID */}

                            <div className="grid md:grid-cols-3 gap-5 print-grid-3">

                                {activityStats.map(
                                    (item) => (
                                        <div
                                            key={
                                                item.category
                                            }
                                            className="bg-white rounded-2xl border border-slate-200 p-6 print-category-card"
                                        >

                                            <div className="flex items-center justify-between">

                                                <h3 className="capitalize text-lg font-black text-slate-700">
                                                    {
                                                        item.category
                                                    }
                                                </h3>

                                                <span className="text-xs font-bold text-slate-400">
                                                    {
                                                        item.count
                                                    }{" "}
                                                    completed
                                                </span>

                                            </div>

                                            <div
                                                className={`text-4xl font-black mt-3 print-category-score ${scoreClass(
                                                    item.score
                                                )}`}
                                            >
                                                {item.score.toFixed(
                                                    1
                                                )}
                                                %
                                            </div>

                                            <div className="h-3 rounded-full bg-slate-100 mt-4 overflow-hidden">

                                                <div
                                                    className="h-full bg-sky-500 rounded-full"
                                                    style={{
                                                        width: `${Math.min(
                                                            100,
                                                            Math.max(
                                                                0,
                                                                item.score
                                                            )
                                                        )}%`,
                                                    }}
                                                />

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>

                        </section>

                        {/* =====================================
                            PROGRESS SUMMARY
                        ===================================== */}

                        <section className="p-8 md:p-12 print-section">

                            <div className="flex items-center gap-3 mb-5">

                                <Trophy className="text-amber-500" />

                                <h2 className="text-2xl font-black text-slate-800">
                                    Progress Summary
                                </h2>

                            </div>

                            {/* PRINT-FIXED 3 COLUMN GRID */}

                            <div className="grid md:grid-cols-3 gap-5 print-grid-3">

                                <div className="rounded-2xl border p-6 print-card">

                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                                        Pre-Assessment
                                    </p>

                                    <p className="text-3xl font-black text-slate-800 mt-2">
                                        {latestAssessment
                                            ? `${preAssessmentScore.toFixed(
                                                  1
                                              )}%`
                                            : "-"}
                                    </p>

                                </div>

                                <div className="rounded-2xl border p-6 print-card">

                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                                        Activity Performance
                                    </p>

                                    <p className="text-3xl font-black text-sky-600 mt-2">
                                        {attempts.length
                                            ? `${overallActivityScore.toFixed(
                                                  1
                                              )}%`
                                            : "-"}
                                    </p>

                                </div>

                                <div className="rounded-2xl border p-6 print-card">

                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                                        Difference
                                    </p>

                                    <p
                                        className={`text-3xl font-black mt-2 ${
                                            improvement ===
                                            null
                                                ? "text-slate-400"
                                                : improvement >=
                                                  0
                                                ? "text-emerald-600"
                                                : "text-rose-600"
                                        }`}
                                    >
                                        {improvement ===
                                        null
                                            ? "-"
                                            : `${
                                                  improvement >=
                                                  0
                                                      ? "+"
                                                      : ""
                                              }${improvement.toFixed(
                                                  1
                                              )}%`}
                                    </p>

                                </div>

                            </div>

                            <div className="mt-6 rounded-2xl bg-sky-50 border border-sky-100 p-6 text-slate-600 leading-relaxed">

                                The pre-assessment identifies handwriting areas that may require support. The activity results summarize the student's recorded performance while completing KineWrite handwriting exercises.

                            </div>

                        </section>

                        {/* =====================================
                            ACTIVITY DETAILS
                        ===================================== */}

                        <section className="px-8 md:px-12 pb-12 print-section">

                            <div className="flex items-center gap-3 mb-5">

                                <Star className="text-amber-500" />

                                <h2 className="text-2xl font-black text-slate-800">
                                    Activity Details
                                </h2>

                            </div>

                            {activityResults.length ? (
                                <div className="overflow-x-auto border border-slate-200 rounded-2xl">

                                    <table className="w-full text-sm">

                                        <thead className="bg-slate-50">

                                            <tr className="text-left">

                                                <th className="p-4">
                                                    #
                                                </th>

                                                <th className="p-4">
                                                    Activity
                                                </th>

                                                <th className="p-4">
                                                    Category
                                                </th>

                                                <th className="p-4">
                                                    Score
                                                </th>

                                                <th className="p-4">
                                                    Stars
                                                </th>

                                                <th className="p-4">
                                                    Items
                                                </th>

                                                <th className="p-4">
                                                    Time
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {activityResults.map(
                                                (
                                                    activity,
                                                    index
                                                ) => (
                                                    <tr
                                                        key={
                                                            activity.activityId ||
                                                            index
                                                        }
                                                        className="border-t border-slate-100"
                                                    >

                                                        <td className="p-4 font-bold">
                                                            {
                                                                index +
                                                                1
                                                            }
                                                        </td>

                                                        <td className="p-4 font-bold text-slate-700">
                                                            {
                                                                activity.title
                                                            }
                                                        </td>

                                                        <td className="p-4 capitalize">
                                                            {
                                                                activity.category
                                                            }
                                                        </td>

                                                        <td
                                                            className={`p-4 font-black ${scoreClass(
                                                                activity.score
                                                            )}`}
                                                        >
                                                            {activity.score.toFixed(
                                                                1
                                                            )}
                                                            %
                                                        </td>

                                                        <td className="p-4">
                                                            {"⭐".repeat(
                                                                activity.stars
                                                            ) ||
                                                                "-"}
                                                        </td>

                                                        <td className="p-4">
                                                            {
                                                                activity.itemCount
                                                            }
                                                        </td>

                                                        <td className="p-4">
                                                            {
                                                                activity.completionTime
                                                            }
                                                            s
                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>
                            ) : (
                                <EmptyState text="No activity attempts have been recorded yet." />
                            )}

                        </section>

                        {/* =====================================
                            LATEST EXERCISE SESSION
                        ===================================== */}

                        <section className="px-8 md:px-12 pb-12 print-section">

                            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">

                                <div className="flex items-center gap-3 mb-4">

                                    <CalendarDays className="text-sky-500" />

                                    <h3 className="text-xl font-black text-slate-800">
                                        Latest Exercise Session
                                    </h3>

                                </div>

                                {latestSession ? (
                                    <div className="grid md:grid-cols-4 gap-5 text-sm print-grid-4">

                                        <div>
                                            <p className="text-slate-400 font-bold">
                                                Session
                                            </p>

                                            <p className="font-black text-slate-700 mt-1">
                                                #
                                                {
                                                    latestSession.session_id
                                                }
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-slate-400 font-bold">
                                                Date
                                            </p>

                                            <p className="font-black text-slate-700 mt-1">
                                                {formatDate(
                                                    latestSession.session_date
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-slate-400 font-bold">
                                                Score
                                            </p>

                                            <p className="font-black text-sky-600 mt-1">
                                                {Number(
                                                    latestSession.total_score ||
                                                        0
                                                ).toFixed(
                                                    1
                                                )}
                                                %
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-slate-400 font-bold">
                                                Stars
                                            </p>

                                            <p className="font-black text-amber-500 mt-1">
                                                ⭐{" "}
                                                {
                                                    latestSession.total_stars ||
                                                    0
                                                }
                                            </p>
                                        </div>

                                    </div>
                                ) : (
                                    <p className="text-slate-500">
                                        No exercise session has been completed yet.
                                    </p>
                                )}

                            </div>

                        </section>

                        {/* =====================================
                            FOOTER
                        ===================================== */}

                        <footer className="px-8 md:px-12 py-8 border-t text-center text-xs text-slate-400 print-footer">

                            KineWrite — Handwriting Assessment and Activity Progress Report

                        </footer>

                    </div>

                </div>

            </div>

            {/* =================================================
                PRINT STYLES
            ================================================= */}

            <style>
                {`
                    @media print {

                        @page {
                            size: A4 portrait;
                            margin: 10mm;
                        }

                        html,
                        body {
                            margin: 0 !important;
                            padding: 0 !important;
                            background: #ffffff !important;
                        }

                        body {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }

                        /* -----------------------------------------
                           HIDE SCREEN-ONLY CONTROLS
                        ----------------------------------------- */

                        .print-hidden {
                            display: none !important;
                        }

                        /* -----------------------------------------
                           MAIN REPORT
                        ----------------------------------------- */

                        .print-report {
                            width: 100% !important;
                            max-width: none !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            border-radius: 0 !important;
                            box-shadow: none !important;
                            overflow: visible !important;
                        }

                        /* -----------------------------------------
                           PAGE BREAK CONTROL
                        ----------------------------------------- */

                        .print-section {
                            break-inside: avoid;
                            page-break-inside: avoid;
                        }

                        .print-card {
                            break-inside: avoid;
                            page-break-inside: avoid;
                        }

                        .report-card {
                            break-inside: avoid;
                            page-break-inside: avoid;
                        }

                        h1,
                        h2,
                        h3 {
                            break-after: avoid;
                            page-break-after: avoid;
                        }

                        /* -----------------------------------------
                           FORCE 5 COLUMN PRINT GRID
                        ----------------------------------------- */

                        .print-grid-5 {
                            display: grid !important;
                            grid-template-columns:
                                repeat(
                                    5,
                                    minmax(0, 1fr)
                                ) !important;
                            gap: 8px !important;
                        }

                        /* -----------------------------------------
                           FORCE 4 COLUMN PRINT GRID
                        ----------------------------------------- */

                        .print-grid-4 {
                            display: grid !important;
                            grid-template-columns:
                                repeat(
                                    4,
                                    minmax(0, 1fr)
                                ) !important;
                            gap: 8px !important;
                        }

                        /* -----------------------------------------
                           FORCE 3 COLUMN PRINT GRID
                        ----------------------------------------- */

                        .print-grid-3 {
                            display: grid !important;
                            grid-template-columns:
                                repeat(
                                    3,
                                    minmax(0, 1fr)
                                ) !important;
                            gap: 8px !important;
                        }

                        /* -----------------------------------------
                           PRINT METRICS
                        ----------------------------------------- */

                        .print-report .rounded-2xl {
                            break-inside: avoid;
                            page-break-inside: avoid;
                        }

                        /* -----------------------------------------
                           TABLE
                        ----------------------------------------- */

                        table {
                            width: 100% !important;
                        }

                        tr {
                            break-inside: avoid;
                            page-break-inside: avoid;
                        }

                        /* -----------------------------------------
                           REDUCE PRINT PADDING
                        ----------------------------------------- */

                        .print-report .p-12 {
                            padding: 20px !important;
                        }

                        .print-report .p-8 {
                            padding: 18px !important;
                        }

                        .print-report .p-6 {
                            padding: 14px !important;
                        }

                        .print-report .p-5 {
                            padding: 12px !important;
                        }

                        /* -----------------------------------------
                           METRIC TEXT
                        ----------------------------------------- */

                        .print-report .text-5xl {
                            font-size: 32px !important;
                            line-height: 1.1 !important;
                        }

                        .print-report .text-4xl {
                            font-size: 28px !important;
                            line-height: 1.1 !important;
                        }

                        .print-report .text-3xl {
                            font-size: 22px !important;
                            line-height: 1.15 !important;
                        }

                        .print-report .text-2xl {
                            font-size: 18px !important;
                        }

                        .print-report .text-xl {
                            font-size: 16px !important;
                        }

                        /* -----------------------------------------
                           ACTIVITY CATEGORY CARDS
                        ----------------------------------------- */

                        .print-category-card {
                            padding: 12px !important;
                        }

                        .print-category-score {
                            font-size: 24px !important;
                            margin-top: 8px !important;
                        }

                        .print-category-card .h-3 {
                            height: 7px !important;
                            margin-top: 8px !important;
                        }

                        /* -----------------------------------------
                           REMOVE EXCESSIVE SCREEN EFFECTS
                        ----------------------------------------- */

                        .shadow-xl,
                        .shadow-lg,
                        .shadow-md {
                            box-shadow: none !important;
                        }

                        /* -----------------------------------------
                           REMOVE LARGE MIN HEIGHTS
                        ----------------------------------------- */

                        .min-h-screen {
                            min-height: 0 !important;
                        }

                        /* -----------------------------------------
                           BACKGROUND COLORS
                        ----------------------------------------- */

                        .print-bg-white {
                            background: #ffffff !important;
                        }

                    }
                `}
            </style>
        </>
    );
};

// =============================================================
// REPORT METRIC
// =============================================================

const ReportMetric = ({
    label,
    value,
    highlight = false,
    small = false,
}) => (
    <div
        className={`rounded-2xl border p-5 print-card ${
            highlight
                ? "bg-sky-50 border-sky-100"
                : "bg-white border-slate-200"
        }`}
    >
        <p className="text-xs font-black uppercase tracking-wider text-slate-400">
            {label}
        </p>

        <p
            className={`${
                small
                    ? "text-xl"
                    : "text-3xl"
            } font-black text-slate-800 mt-2 break-words`}
        >
            {value}
        </p>
    </div>
);

// =============================================================
// EMPTY STATE
// =============================================================

const EmptyState = ({ text }) => (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-500">
        {text}
    </div>
);

export default Reports;