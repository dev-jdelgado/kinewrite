// src/pages/TakeHomeActivity.jsx

import {
    ArrowLeft,
    Check,
    Printer,
    RotateCcw,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import StudentService
    from "../services/StudentService";

import exerciseData
    from "../utils/exerciseData";

import StrokeGuide
    from "../components/assessment/handwriting/StrokeGuide";


// ======================================================
// TAKE-HOME OPTIONS
// ======================================================

const takeHomeOptions = [
    {
        id: "write-letter",
        title: "Write a Letter",
        description:
            "Practice writing individual letters independently.",
        mode: "write-letter",
        icon: "✏️",
    },

    {
        id: "write-word",
        title: "Write a Word",
        description:
            "Practice copying simple words with proper letter spacing.",
        mode: "copy-word",
        icon: "📝",
    },

    {
        id: "write-sentence",
        title: "Write a Sentence",
        description:
            "Practice copying complete sentences with consistent spacing.",
        mode: "copy-sentence",
        icon: "📖",
    },

    {
        id: "trace-line",
        title: "Trace a Line Stroke",
        description:
            "Practice controlled hand movement by tracing different line strokes.",
        mode: "trace-line",
        icon: "➖",
    },

    {
        id: "trace-shape",
        title: "Trace a Shape Stroke",
        description:
            "Practice controlled movement by tracing basic shapes.",
        mode: "trace-shape",
        icon: "⭕",
    },
];


// ======================================================
// GET ACTIVITY DATA
// ======================================================

const getActivityForMode = (
    mode
) => {

    return exerciseData.find(
        activity =>
            activity.mode === mode
    );

};


// ======================================================
// HANDWRITING LINES
// ======================================================

const WritingLines = ({
    count = 2,
}) => {

    return (

        <div
            className="
                mt-8
                space-y-8
            "
        >

            {Array.from({
                length: count,
            }).map(
                (
                    _,
                    index
                ) => (

                    <div
                        key={index}
                        className="
                            relative
                            h-[94px]
                        "
                    >

                        {/* Top Blue Guide */}

                        <div
                            className="
                                absolute
                                left-0
                                right-0
                                top-[10px]
                                border-b-[2px]
                                border-blue-300
                            "
                        />


                        {/* Red Baseline */}

                        <div
                            className="
                                absolute
                                left-0
                                right-0
                                top-[52px]
                                border-b-[2px]
                                border-red-400
                            "
                        />


                        {/* Bottom Blue Guide */}

                        <div
                            className="
                                absolute
                                left-0
                                right-0
                                top-[94px]
                                border-b-[2px]
                                border-blue-300
                            "
                        />

                    </div>

                )
            )}

        </div>

    );

};


// ======================================================
// TRACE LINE GUIDE
// ======================================================

const TraceLinePractice = ({
    prompt,
}) => {

    const strokeType =
        String(
            prompt || ""
        ).toLowerCase();


    return (

        <div
            className="
                mt-6
                rounded-2xl
                border-2
                border-slate-200
                bg-white
                p-7
            "
        >

            <div
                className="
                    text-center
                    text-xs
                    uppercase
                    tracking-widest
                    font-black
                    text-slate-500
                "
            >
                Trace the {prompt} Line
            </div>


            <div
                className="
                    mt-6
                    h-[230px]
                    rounded-xl
                    border
                    border-slate-100
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                "
            >

                <div
                    className="
                        w-full
                        h-full
                        flex
                        items-center
                        justify-center
                        p-5
                    "
                >

                    <div
                        className="
                            w-full
                            h-full
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <StrokeGuide
                            type={
                                strokeType
                            }
                        />

                    </div>

                </div>

            </div>

        </div>

    );

};


// ======================================================
// TRACE SHAPE PRACTICE
// ======================================================

const TraceShapePractice = ({
    prompt,
}) => {

    const shape =
        String(
            prompt || ""
        )
            .trim()
            .toLowerCase();


    const renderShape = () => {

        switch (shape) {

            case "circle":

                return (
                    <div
                        className="
                            w-40
                            h-40
                            rounded-full
                            border-[5px]
                            border-dashed
                            border-slate-400
                        "
                    />
                );


            case "square":

                return (
                    <div
                        className="
                            w-40
                            h-40
                            border-[5px]
                            border-dashed
                            border-slate-400
                        "
                    />
                );


            case "triangle":

                return (
                    <svg
                        viewBox="0 0 160 160"
                        className="
                            w-40
                            h-40
                        "
                    >

                        <path
                            d="
                                M80 10
                                L150 145
                                L10 145
                                Z
                            "
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth="5"
                            strokeDasharray="9 8"
                        />

                    </svg>
                );


            case "rectangle":

                return (
                    <div
                        className="
                            w-52
                            h-32
                            border-[5px]
                            border-dashed
                            border-slate-400
                        "
                    />
                );


            case "oval":

                return (
                    <div
                        className="
                            w-52
                            h-36
                            rounded-[50%]
                            border-[5px]
                            border-dashed
                            border-slate-400
                        "
                    />
                );


            default:

                return (
                    <div
                        className="
                            text-slate-400
                            font-bold
                        "
                    >
                        {prompt}
                    </div>
                );

        }

    };


    return (

        <div
            className="
                mt-6
                rounded-2xl
                border-2
                border-slate-200
                bg-white
                p-7
            "
        >

            <div
                className="
                    text-center
                    text-xs
                    uppercase
                    tracking-widest
                    font-black
                    text-slate-500
                "
            >
                Trace the Shape
            </div>


            <div
                className="
                    mt-4
                    text-center
                    text-2xl
                    font-black
                    text-slate-600
                "
            >
                {prompt}
            </div>


            <div
                className="
                    mt-6
                    h-[230px]
                    flex
                    items-center
                    justify-center
                "
            >

                {renderShape()}

            </div>

        </div>

    );

};


// ======================================================
// PRACTICE ITEM
// ======================================================

const PracticeItem = ({
    option,
    item,
    index,
}) => {

    const prompt =
        String(
            item?.promptText || ""
        );


    const mode =
        option.mode;


    return (

        <div
            className="
                take-home-item
                rounded-3xl
                border-2
                border-slate-200
                bg-white
                p-6
                sm:p-8
                mb-7
                break-inside-avoid
            "
        >

            {/* Practice Header */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-4
                "
            >

                <div
                    className="
                        text-xs
                        uppercase
                        tracking-widest
                        font-black
                        text-slate-400
                    "
                >
                    Practice {index + 1}
                </div>


                <div
                    className="
                        text-xs
                        uppercase
                        tracking-widest
                        font-black
                        text-slate-500
                    "
                >
                    {option.title}
                </div>

            </div>


            {/* ========================================== */}
            {/* WRITE LETTER */}
            {/* ========================================== */}

            {mode === "write-letter" && (

                <div
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        p-6
                    "
                >

                    <div
                        className="
                            text-center
                            text-xs
                            uppercase
                            tracking-widest
                            font-black
                            text-slate-500
                        "
                    >
                        Write the Letter
                    </div>


                    <div
                        className="
                            mt-5
                            text-center
                            text-6xl
                            font-black
                            text-slate-400
                        "
                    >
                        {prompt}
                    </div>


                    <WritingLines
                        count={2}
                    />

                </div>

            )}


            {/* ========================================== */}
            {/* WRITE WORD */}
            {/* ========================================== */}

            {mode === "copy-word" && (

                <div
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        p-6
                    "
                >

                    <div
                        className="
                            text-center
                            text-xs
                            uppercase
                            tracking-widest
                            font-black
                            text-slate-500
                        "
                    >
                        Write the Word
                    </div>


                    <div
                        className="
                            mt-5
                            text-center
                            text-4xl
                            sm:text-5xl
                            font-black
                            text-slate-500
                        "
                    >
                        {prompt}
                    </div>


                    <WritingLines
                        count={2}
                    />

                </div>

            )}


            {/* ========================================== */}
            {/* WRITE SENTENCE */}
            {/* ========================================== */}

            {mode === "copy-sentence" && (

                <div
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        p-6
                    "
                >

                    <div
                        className="
                            text-center
                            text-xs
                            uppercase
                            tracking-widest
                            font-black
                            text-slate-500
                        "
                    >
                        Write the Sentence
                    </div>


                    <div
                        className="
                            mt-5
                            text-center
                            text-xl
                            sm:text-2xl
                            font-black
                            leading-9
                            text-slate-500
                        "
                    >
                        {prompt}
                    </div>


                    <WritingLines
                        count={2}
                    />

                </div>

            )}


            {/* ========================================== */}
            {/* TRACE LINE */}
            {/* ========================================== */}

            {mode === "trace-line" && (

                <TraceLinePractice
                    prompt={prompt}
                />

            )}


            {/* ========================================== */}
            {/* TRACE SHAPE */}
            {/* ========================================== */}

            {mode === "trace-shape" && (

                <TraceShapePractice
                    prompt={prompt}
                />

            )}

        </div>

    );

};


// ======================================================
// PRINTABLE WORKSHEET
// ======================================================

const PrintableWorksheet = ({
    studentName,
    activities,
}) => {

    return (

        <div
            className="
                take-home-printable
                bg-white
                text-slate-800
            "
        >

            {/* HEADER */}

            <div
                className="
                    border-b-4
                    border-slate-800
                    pb-5
                    mb-8
                "
            >

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-6
                    "
                >

                    <div>

                        <div
                            className="
                                text-xs
                                uppercase
                                tracking-[0.2em]
                                font-black
                                text-slate-500
                            "
                        >
                            KineWrite
                        </div>


                        <h1
                            className="
                                mt-2
                                text-3xl
                                font-black
                                text-slate-800
                            "
                        >
                            Take-Home Practice
                        </h1>


                        <p
                            className="
                                mt-2
                                text-sm
                                text-slate-500
                            "
                        >
                            Handwriting practice selected
                            for home practice.
                        </p>

                    </div>


                    <div
                        className="
                            text-right
                        "
                    >

                        <div
                            className="
                                text-xs
                                uppercase
                                tracking-widest
                                font-black
                                text-slate-400
                            "
                        >
                            Student
                        </div>


                        <div
                            className="
                                mt-1
                                text-xl
                                font-black
                                text-slate-800
                            "
                        >
                            {studentName}
                        </div>

                    </div>

                </div>


                {/* Student Information */}

                <div
                    className="
                        mt-6
                        grid
                        grid-cols-2
                        gap-8
                    "
                >

                    <div>

                        <div
                            className="
                                text-[10px]
                                uppercase
                                tracking-widest
                                font-black
                                text-slate-400
                            "
                        >
                            Date
                        </div>


                        <div
                            className="
                                mt-2
                                h-6
                                border-b-2
                                border-slate-300
                            "
                        />

                    </div>


                    <div>

                        <div
                            className="
                                text-[10px]
                                uppercase
                                tracking-widest
                                font-black
                                text-slate-400
                            "
                        >
                            Parent / Guardian
                        </div>


                        <div
                            className="
                                mt-2
                                h-6
                                border-b-2
                                border-slate-300
                            "
                        />

                    </div>

                </div>

            </div>


            {/* SELECTED ACTIVITIES */}

            {activities.map(
                (
                    activity,
                    index
                ) => (

                    <section
                        key={
                            `${activity.option.id}-${index}`
                        }
                        className="
                            take-home-section
                            mb-10
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-4
                                mb-5
                            "
                        >

                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-full
                                    border-2
                                    border-slate-300
                                    flex
                                    items-center
                                    justify-center
                                    text-xl
                                "
                            >
                                {
                                    activity.option.icon
                                }
                            </div>


                            <div>

                                <div
                                    className="
                                        text-xs
                                        uppercase
                                        tracking-widest
                                        font-black
                                        text-slate-400
                                    "
                                >
                                    Practice Type
                                </div>


                                <h2
                                    className="
                                        mt-1
                                        text-2xl
                                        font-black
                                        text-slate-800
                                    "
                                >
                                    {
                                        activity.option.title
                                    }
                                </h2>

                            </div>

                        </div>


                        {activity.items.map(
                            (
                                item,
                                itemIndex
                            ) => (

                                <PracticeItem
                                    key={
                                        `${activity.option.id}-${itemIndex}`
                                    }
                                    option={
                                        activity.option
                                    }
                                    item={
                                        item
                                    }
                                    index={
                                        itemIndex
                                    }
                                />

                            )
                        )}

                    </section>

                )
            )}


            {/* FOOTER */}

            <div
                className="
                    pt-5
                    mt-8
                    border-t-2
                    border-slate-200
                    flex
                    items-center
                    justify-between
                    text-xs
                    text-slate-400
                "
            >

                <span
                    className="
                        font-bold
                    "
                >
                    KineWrite
                </span>


                <span>
                    Keep practicing!
                </span>

            </div>

        </div>

    );

};


// ======================================================
// MAIN COMPONENT
// ======================================================

const TakeHomeActivity = () => {

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        studentId,
    } = useParams();


    const [student, setStudent] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    const [
        selectedOptions,
        setSelectedOptions,
    ] = useState([]);


    // ==================================================
    // GENERATED WORKSHEET
    // ==================================================

    const generatedActivities =
        location.state?.takeHomeActivities;


    const isWorksheetMode =
        Array.isArray(
            generatedActivities
        ) &&
        generatedActivities.length > 0;


    // ==================================================
    // LOAD STUDENT
    // ==================================================

    useEffect(() => {

        const loadStudent = async () => {

            if (!studentId) {

                setLoading(false);

                return;

            }


            try {

                setLoading(true);


                const response =
                    await StudentService.getStudent(
                        studentId
                    );


                setStudent(
                    response?.data?.student ||
                    null
                );

            } catch (error) {

                console.error(
                    "Take-home student error:",
                    error
                );


                toast.error(
                    "Unable to load student."
                );


                navigate(
                    "/student-records"
                );

            } finally {

                setLoading(false);

            }

        };


        loadStudent();

    }, [
        studentId,
        navigate,
    ]);


    // ==================================================
    // STUDENT NAME
    // ==================================================

    const studentName =
        student
            ? [
                student.student_fname,
                student.student_lname,
            ]
                .filter(Boolean)
                .join(" ")
            : "";


    // ==================================================
    // TOGGLE OPTION
    // ==================================================

    const toggleOption = (
        optionId
    ) => {

        setSelectedOptions(
            previous => {

                if (
                    previous.includes(
                        optionId
                    )
                ) {

                    return previous.filter(
                        id =>
                            id !== optionId
                    );

                }


                return [
                    ...previous,
                    optionId,
                ];

            }
        );

    };


    // ==================================================
    // SELECT ALL
    // ==================================================

    const selectAll = () => {

        setSelectedOptions(
            takeHomeOptions.map(
                option =>
                    option.id
            )
        );

    };


    // ==================================================
    // CLEAR
    // ==================================================

    const clearSelection = () => {

        setSelectedOptions(
            []
        );

    };


    // ==================================================
    // GENERATE WORKSHEET
    // ==================================================

    const generateWorksheet = () => {

        if (
            selectedOptions.length === 0
        ) {

            toast.error(
                "Please select at least one practice type."
            );

            return;

        }


        const activities =
            selectedOptions
                .map(
                    optionId =>
                        takeHomeOptions.find(
                            option =>
                                option.id ===
                                optionId
                        )
                )
                .filter(Boolean)
                .map(
                    option => {

                        const sourceActivity =
                            getActivityForMode(
                                option.mode
                            );


                        if (
                            !sourceActivity
                        ) {

                            return null;

                        }


                        let items =
                            Array.isArray(
                                sourceActivity.items
                            )
                                ? sourceActivity.items
                                : [];


                        /*
                         * For Take-Home only:
                         * remove the duplicate Diagonal
                         * from the existing Trace the Lines
                         * activity.
                         *
                         * We do not modify exerciseData.js.
                         */

                        if (
                            option.mode ===
                            "trace-line"
                        ) {

                            const seen =
                                new Set();


                            items =
                                items.filter(
                                    item => {

                                        const value =
                                            String(
                                                item.promptText
                                            )
                                                .trim()
                                                .toLowerCase();


                                        if (
                                            seen.has(
                                                value
                                            )
                                        ) {

                                            return false;

                                        }


                                        seen.add(
                                            value
                                        );


                                        return true;

                                    }
                                );

                        }


                        return {
                            option,
                            sourceActivity,
                            items:
                                items.slice(
                                    0,
                                    5
                                ),
                        };

                    }
                )
                .filter(Boolean);


        if (
            activities.length === 0
        ) {

            toast.error(
                "No practice activities were found."
            );

            return;

        }


        navigate(
            `/take-home/${studentId}`,
            {
                state: {
                    takeHomeActivities:
                        activities,
                },
            }
        );

    };


    // ==================================================
    // PRINT
    // ==================================================

    const printWorksheet = () => {

        window.print();

    };


    // ==================================================
    // BACK TO SELECTION
    // ==================================================

    const backToSelection = () => {

        navigate(
            `/take-home/${studentId}`,
            {
                replace: true,
                state: {},
            }
        );

    };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div
                className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    bg-white
                "
            >

                <div
                    className="
                        text-center
                    "
                >

                    <div
                        className="
                            w-12
                            h-12
                            mx-auto
                            border-4
                            border-slate-200
                            border-t-slate-700
                            rounded-full
                            animate-spin
                        "
                    />


                    <p
                        className="
                            mt-4
                            font-bold
                            text-slate-500
                        "
                    >
                        Loading student...
                    </p>

                </div>

            </div>

        );

    }


    // ==================================================
    // STUDENT NOT FOUND
    // ==================================================

    if (!student) {

        return (

            <div
                className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    bg-white
                    px-6
                "
            >

                <div
                    className="
                        bg-white
                        border
                        border-slate-200
                        rounded-3xl
                        shadow-lg
                        p-10
                        text-center
                    "
                >

                    <h2
                        className="
                            text-2xl
                            font-black
                            text-slate-800
                        "
                    >
                        Student Not Found
                    </h2>


                    <p
                        className="
                            mt-3
                            text-slate-500
                        "
                    >
                        The selected student record
                        could not be found.
                    </p>


                    <button
                        onClick={() =>
                            navigate(
                                "/student-records"
                            )
                        }
                        className="
                            mt-6
                            px-5
                            py-3
                            rounded-2xl
                            bg-slate-800
                            text-white
                            font-black
                        "
                    >
                        Back to Students
                    </button>

                </div>

            </div>

        );

    }


    // ==================================================
    // WORKSHEET MODE
    // ==================================================

    if (
        isWorksheetMode
    ) {

        return (

            <div
                className="
                    min-h-screen
                    bg-white
                    px-5
                    py-8
                    print:bg-white
                    print:p-0
                "
            >

                {/* Screen Controls */}

                <div
                    className="
                        max-w-[900px]
                        mx-auto
                        mb-6
                        flex
                        items-center
                        justify-between
                        gap-4
                        print:hidden
                    "
                >

                    <button
                        onClick={
                            backToSelection
                        }
                        className="
                            flex
                            items-center
                            gap-2
                            font-bold
                            text-slate-600
                            hover:text-slate-900
                        "
                    >

                        <ArrowLeft
                            size={20}
                        />

                        Back to Activities

                    </button>


                    <button
                        onClick={
                            printWorksheet
                        }
                        className="
                            flex
                            items-center
                            gap-2
                            px-6
                            py-3
                            rounded-2xl
                            bg-slate-800
                            hover:bg-slate-900
                            text-white
                            font-black
                            shadow-lg
                            transition
                        "
                    >

                        <Printer
                            size={20}
                        />

                        Print Worksheet

                    </button>

                </div>


                {/* Printable Area */}

                <div
                    className="
                        max-w-[900px]
                        mx-auto
                        bg-white
                        p-8
                        md:p-12
                        print:max-w-none
                        print:p-0
                    "
                >

                    <PrintableWorksheet
                        studentName={
                            studentName
                        }
                        activities={
                            generatedActivities
                        }
                    />

                </div>

            </div>

        );

    }


    // ==================================================
    // SELECTION MODE
    // ==================================================

    return (

        <div
            className="
                min-h-screen
                bg-white
                px-5
                py-8
            "
        >

            <div
                className="
                    max-w-5xl
                    mx-auto
                "
            >

                {/* HEADER */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        mb-8
                    "
                >

                    <button
                        onClick={() =>
                            navigate(-1)
                        }
                        className="
                            flex
                            items-center
                            gap-2
                            font-bold
                            text-slate-600
                            hover:text-slate-900
                        "
                    >

                        <ArrowLeft
                            size={22}
                        />

                        Back

                    </button>


                    <div
                        className="
                            text-center
                        "
                    >

                        <div
                            className="
                                text-xs
                                uppercase
                                tracking-[0.2em]
                                font-black
                                text-slate-400
                            "
                        >
                            KineWrite
                        </div>


                        <h1
                            className="
                                mt-2
                                text-3xl
                                sm:text-4xl
                                font-black
                                text-slate-800
                            "
                        >
                            Take-Home Practice
                        </h1>


                        <p
                            className="
                                mt-2
                                text-slate-500
                            "
                        >

                            Select handwriting practice for{" "}

                            <span
                                className="
                                    font-black
                                    text-slate-800
                                "
                            >
                                {studentName}
                            </span>

                        </p>

                    </div>


                    <div
                        className="
                            w-[70px]
                            sm:w-[110px]
                        "
                    />

                </div>


                {/* SUMMARY */}

                <div
                    className="
                        border
                        border-slate-200
                        rounded-2xl
                        p-5
                        mb-8
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-4
                    "
                >

                    <div>

                        <div
                            className="
                                text-xs
                                uppercase
                                tracking-widest
                                font-black
                                text-slate-400
                            "
                        >
                            Practice Types Selected
                        </div>


                        <div
                            className="
                                mt-1
                                text-2xl
                                font-black
                                text-slate-800
                            "
                        >
                            {
                                selectedOptions.length
                            }
                        </div>

                    </div>


                    <div
                        className="
                            flex
                            flex-wrap
                            gap-3
                        "
                    >

                        <button
                            type="button"
                            onClick={
                                selectAll
                            }
                            className="
                                px-4
                                py-2.5
                                rounded-xl
                                border
                                border-slate-200
                                text-slate-600
                                font-black
                                hover:bg-slate-50
                            "
                        >
                            Select All
                        </button>


                        <button
                            type="button"
                            onClick={
                                clearSelection
                            }
                            disabled={
                                selectedOptions.length === 0
                            }
                            className="
                                px-4
                                py-2.5
                                rounded-xl
                                border
                                border-slate-200
                                text-slate-500
                                font-black
                                disabled:opacity-40
                            "
                        >

                            <RotateCcw
                                size={16}
                                className="
                                    inline
                                    mr-1
                                "
                            />

                            Clear

                        </button>


                        <button
                            type="button"
                            onClick={
                                generateWorksheet
                            }
                            disabled={
                                selectedOptions.length === 0
                            }
                            className="
                                px-5
                                py-2.5
                                rounded-xl
                                bg-slate-800
                                hover:bg-slate-900
                                disabled:bg-slate-200
                                disabled:text-slate-400
                                text-white
                                font-black
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <Printer
                                size={18}
                            />

                            Generate Worksheet

                        </button>

                    </div>

                </div>


                {/* FIVE OPTIONS */}

                <div
                    className="
                        grid
                        sm:grid-cols-2
                        lg:grid-cols-3
                        gap-5
                    "
                >

                    {takeHomeOptions.map(
                        option => {

                            const selected =
                                selectedOptions.includes(
                                    option.id
                                );


                            return (

                                <button
                                    key={
                                        option.id
                                    }
                                    type="button"
                                    onClick={() =>
                                        toggleOption(
                                            option.id
                                        )
                                    }
                                    className={`
                                        relative
                                        text-left
                                        bg-white
                                        rounded-3xl
                                        p-6
                                        border-2
                                        transition-all
                                        duration-200
                                        shadow-sm
                                        hover:shadow-md
                                        ${
                                            selected
                                                ? "border-slate-800 shadow-md"
                                                : "border-slate-200"
                                        }
                                    `}
                                >

                                    {/* Check */}

                                    <div
                                        className={`
                                            absolute
                                            top-5
                                            right-5
                                            w-8
                                            h-8
                                            rounded-full
                                            flex
                                            items-center
                                            justify-center
                                            border-2
                                            ${
                                                selected
                                                    ? "bg-slate-800 border-slate-800 text-white"
                                                    : "bg-white border-slate-300 text-transparent"
                                            }
                                        `}
                                    >

                                        <Check
                                            size={17}
                                            strokeWidth={3}
                                        />

                                    </div>


                                    {/* Icon */}

                                    <div
                                        className="
                                            w-14
                                            h-14
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            flex
                                            items-center
                                            justify-center
                                            text-2xl
                                        "
                                    >
                                        {
                                            option.icon
                                        }
                                    </div>


                                    {/* Title */}

                                    <h2
                                        className="
                                            mt-5
                                            pr-10
                                            text-xl
                                            font-black
                                            text-slate-800
                                        "
                                    >
                                        {
                                            option.title
                                        }
                                    </h2>


                                    {/* Description */}

                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            leading-6
                                            text-slate-500
                                        "
                                    >
                                        {
                                            option.description
                                        }
                                    </p>


                                    {/* Count */}

                                    <div
                                        className="
                                            mt-5
                                            text-xs
                                            uppercase
                                            tracking-widest
                                            font-black
                                            text-slate-400
                                        "
                                    >
                                        5 practice items
                                    </div>

                                </button>

                            );

                        }
                    )}

                </div>


                {/* BOTTOM BUTTON */}

                <div
                    className="
                        mt-8
                        flex
                        justify-center
                    "
                >

                    <button
                        type="button"
                        onClick={
                            generateWorksheet
                        }
                        disabled={
                            selectedOptions.length === 0
                        }
                        className="
                            px-8
                            py-4
                            rounded-2xl
                            bg-slate-800
                            hover:bg-slate-900
                            disabled:bg-slate-200
                            disabled:text-slate-400
                            text-white
                            font-black
                            shadow-lg
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <Printer
                            size={21}
                        />

                        Generate Take-Home Worksheet

                    </button>

                </div>

            </div>

        </div>

    );

};


// ======================================================
// PRINT STYLES
// ======================================================

if (
    typeof document !== "undefined" &&
    !document.getElementById(
        "kinewrite-take-home-print"
    )
) {

    const style =
        document.createElement(
            "style"
        );


    style.id =
        "kinewrite-take-home-print";


    style.innerHTML = `

        @page {
            size: A4 portrait;
            margin: 12mm;
        }


        @media print {

            html,
            body {
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
            }


            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }


            .take-home-printable {
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
            }


            .take-home-section {
                break-inside: auto;
                page-break-inside: auto;
            }


            .take-home-item {
                break-inside: avoid;
                page-break-inside: avoid;
            }


            .take-home-item,
            .take-home-section {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

        }

    `;


    document.head.appendChild(
        style
    );

}


export default TakeHomeActivity;