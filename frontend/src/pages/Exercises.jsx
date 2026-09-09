import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    RotateCcw,
    Sparkles,
    Star,
    Trophy,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import HandwritingWorksheet from "../components/assessment/handwriting/HandwritingWorksheet";
import HandwritingToolbar from "../components/assessment/handwriting/HandwritingToolbar";

import exerciseData from "../utils/exerciseData";

import ExerciseGuide from "../components/exercises/ExerciseGuide";
import ExerciseService from "../services/ExerciseService";
import { calculateActivityScore } from "../utils/activityScoring";


const categoryNames = {
    spacing: "Spacing",
    alignment: "Alignment",
    stroke: "Stroke",
};


const categoryClasses = {
    spacing:
        "bg-blue-100 text-blue-700",

    alignment:
        "bg-orange-100 text-orange-700",

    stroke:
        "bg-green-100 text-green-700",
};


const modeTitles = {
    "copy-word":
        "Copy the Word",

    "copy-phrase":
        "Copy the Phrase",

    "complete-sentence":
        "Complete the Sentence",

    "copy-sentence":
        "Copy the Sentence",

    "spacing-challenge":
        "Spacing Challenge",

    "write-line":
        "Write on the Line",

    "follow-line":
        "Follow the Writing Line",

    "ruled-sentence":
        "Copy Sentences on Ruled Lines",

    "stay-box":
        "Stay Inside the Box",

    "alignment-path":
        "Alignment Path",

    "trace-line":
        "Trace the Lines",

    "trace-shape":
        "Trace the Shapes",

    "trace-letter":
        "Trace the Letters",

    "write-letter":
        "Write the Letter",

    "stroke-challenge":
        "Stroke Challenge",
};


const getInstruction = (activity) => {

    const instructions = {

        "copy-word":
            "Look at the word and copy it carefully. Keep the letters evenly spaced.",

        "copy-phrase":
            "Copy the phrase. Keep a clear and consistent space between each word.",

        "complete-sentence":
            "Complete the sentence using your own handwriting while keeping the spacing consistent.",

        "copy-sentence":
            "Copy the entire sentence. Try to maintain the same spacing from beginning to end.",

        "spacing-challenge":
            "Rewrite the text and add the correct spaces between the words.",

        "write-line":
            "Write the word directly on the writing line.",

        "follow-line":
            "Write the word while keeping your handwriting aligned with the guide line.",

        "ruled-sentence":
            "Copy the sentence while keeping your writing aligned with the ruled line.",

        "stay-box":
            "Write inside the box. Try not to let your writing cross the boundary.",

        "alignment-path":
            "Follow the path while keeping your writing aligned with the guide.",

        "trace-line":
            "Trace the guide carefully. Follow the direction and shape of the line.",

        "trace-shape":
            "Trace the shape carefully. Try to stay directly on the guide.",

        "trace-letter":
            "Trace the letter while following its shape.",

        "write-letter":
            "Look at the model letter and write it independently.",

        "stroke-challenge":
            "Write the word independently using controlled and deliberate strokes.",
    };


    return (
        instructions[activity?.mode] ||
        activity?.description ||
        "Complete the handwriting activity."
    );

};

const getAlignmentGuide = (
    mode,
    itemIndex
) => {

    if (
        mode === "write-line" ||
        mode === "follow-line"
    ) {

        return (
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    z-0
                "
            >
                <div
                    className="
                        absolute
                        left-[8%]
                        right-[8%]
                        top-[60%]
                        border-b-[4px]
                        border-sky-400
                    "
                />
            </div>
        );

    }


    if (
        mode === "ruled-sentence"
    ) {

        return (
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    z-0
                    bg-white
                "
            >

                {/* Red margin */}
                <div
                    className="
                        absolute
                        top-0
                        bottom-0
                        left-[12%]
                        border-l-[3px]
                        border-red-400
                    "
                />

                {/* Blue ruled lines */}
                {[22, 38, 54, 70, 86].map(
                    top => (
                        <div
                            key={top}
                            className="
                                absolute
                                left-0
                                right-0
                                border-b-[2px]
                                border-blue-300
                            "
                            style={{
                                top: `${top}%`,
                            }}
                        />
                    )
                )}

            </div>
        );

    }


    if (
        mode === "stay-box"
    ) {

        return (
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    z-0
                "
            >

                <div
                    className="
                        absolute
                        left-[12%]
                        right-[12%]
                        top-[25%]
                        bottom-[25%]
                        border-[4px]
                        border-dashed
                        border-orange-400
                        rounded-2xl
                    "
                />

            </div>
        );

    }


    if (
        mode === "alignment-path"
    ) {

        return (
            <svg
                className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    pointer-events-none
                    z-0
                "
                viewBox="0 0 1000 600"
                preserveAspectRatio="none"
            >

                <path
                    d="
                        M 80 360
                        C 220 260,
                          300 460,
                          440 350
                        S 680 230,
                          920 360
                    "
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="8"
                    strokeDasharray="16 12"
                    strokeLinecap="round"
                />

            </svg>
        );

    }


    return null;
};

const getActivityProgress = (
    activity,
    history
) => {

    const attempts = history.filter(
        attempt => {

            let meta = {};

            try {
                meta =
                    typeof attempt.stroke_data === "string"
                        ? JSON.parse(attempt.stroke_data)
                        : attempt.stroke_data || {};
            } catch {
                meta = {};
            }

            return (
                String(meta.activityId) ===
                String(activity.id)
            );

        }
    );

    if (!attempts.length) {
        return {
            completed: false,
            score: null,
        };
    }

    const scores = attempts
        .map(attempt => Number(attempt.accuracy))
        .filter(score => Number.isFinite(score));

    if (!scores.length) {
        return {
            completed: true,
            score: null,
        };
    }

    const average =
        scores.reduce(
            (sum, value) => sum + value,
            0
        ) / scores.length;

    return {
        completed: true,
        score: Number(
            average.toFixed(2)
        ),
    };

};

const Exercises = () => {

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const { studentId } =
        useParams();


    const canvasRef =
        useRef(null);


    const [activity, setActivity] =
        useState(
            location.state?.activity || null
        );


    const [itemIndex, setItemIndex] =
        useState(0);


    const [score, setScore] =
        useState(0);


    const [checked, setChecked] =
        useState(false);


    const [completed, setCompleted] =
        useState(false);


    const [showActivities, setShowActivities] =
        useState(!activity);

    const sessionIdRef = useRef(null);
    const sessionStartPromiseRef = useRef(null);
    const itemStartedAtRef = useRef(Date.now());
    const [savingAttempt, setSavingAttempt] = useState(false);

    const [lastResult, setLastResult] = useState(null);
    
    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const ensureExerciseSession = async () => {
        if (sessionIdRef.current) return sessionIdRef.current;
        if (sessionStartPromiseRef.current) return sessionStartPromiseRef.current;
        sessionStartPromiseRef.current = ExerciseService.startSession(Number(studentId))
            .then(response => {
                const id = response?.data?.session?.session_id;
                if (!id) throw new Error("Exercise session ID was not returned.");
                sessionIdRef.current = id;
                return id;
            })
            .finally(() => { sessionStartPromiseRef.current = null; });
        return sessionStartPromiseRef.current;
    };

    useEffect(() => {
        if (!studentId || !showActivities) return;
    
        const loadExerciseHistory = async () => {
            setHistoryLoading(true);
    
            try {
                const response =
                    await ExerciseService.getStudentHistory(
                        Number(studentId)
                    );
    
                const history =
                    response?.data?.attempts || [];
                
                setExerciseHistory(
                    Array.isArray(history)
                        ? history
                        : []
                );
    
            } catch (error) {
                console.error(
                    "Failed to load exercise history:",
                    error
                );
    
                setExerciseHistory([]);
    
            } finally {
                setHistoryLoading(false);
            }
        };
    
        loadExerciseHistory();
    
    }, [
        studentId,
        showActivities,
    ]);

    useEffect(() => {

        itemStartedAtRef.current =
            Date.now();
    
        if (
            activity &&
            studentId
        ) {
    
            ensureExerciseSession()
                .catch(error => {
    
                    console.error(
                        "Exercise session start failed:",
                        error
                    );
    
                });
    
        }
    
    }, [
        activity?.id,
        studentId,
    ]);


    const currentItem =
        activity?.items?.[itemIndex];

    // Stroke Activities 1–3 already display their tracing guide
    // directly on the handwriting canvas, so the separate model card
    // above the canvas is redundant for those three activities.
    const hideStrokeModel =
        activity?.category === "stroke" &&
        [
            "stroke-trace-lines",
            "stroke-trace-shapes",
            "stroke-trace-letters",
        ].includes(activity?.id);


    // ==========================================
    // Select Activity
    // ==========================================

    const selectActivity = (
        selected
    ) => {

        setActivity(
            selected
        );

        setItemIndex(
            0
        );

        setScore(
            0
        );

        setChecked(
            false
        );

        setCompleted(
            false
        );

        setShowActivities(
            false
        );

        setLastResult(null);
        itemStartedAtRef.current = Date.now();
        ensureExerciseSession().catch(console.error);


        setTimeout(() => {

            canvasRef.current?.clear?.();

        }, 100);

    };


    // ==========================================
    // Clear
    // ==========================================

    const handleClear = () => {

        canvasRef.current?.clear?.();

        setChecked(
            false
        );

    };


    // ==========================================
    // Check Item + Score + Save
    // ==========================================

    const handleCheck = async () => {
        if (checked || savingAttempt) return;
        const strokes = canvasRef.current?.getStrokes?.() || [];
        if (!strokes.some(stroke => Array.isArray(stroke) && stroke.length > 1)) {
            alert("Please complete the activity first.");
            return;
        }
        setSavingAttempt(true);
        try {
            const result = calculateActivityScore({
                category: activity.category,
                mode: activity.mode,
                prompt: currentItem.promptText,
                strokes,
            });
            const sessionId = await ensureExerciseSession();
            const handwritingImage = canvasRef.current?.exportImage?.() || null;
            const completionTime = Math.max(0, Math.round((Date.now() - itemStartedAtRef.current) / 1000));
            await ExerciseService.saveAttempt({
                sessionId, exerciseId: Number(activity.exerciseId) || null,
                accuracy: result.score, completionTime, stars: result.stars, attempts: 1,
                handwritingImage,
                strokeData: {
                    activityId: activity.id, activityTitle: activity.title, category: activity.category,
                    mode: activity.mode, activityType: activity.activityType, itemNo: currentItem.itemNo,
                    promptText: currentItem.promptText, metrics: result.metrics, score: result.score,
                    stars: result.stars, strokes,
                },
                strokeCount: strokes.length, penLifts: Math.max(0, strokes.length - 1),
            });
            setLastResult(result);
            // Store the running activity average, not the sum of item scores.
            // Each activity contains multiple items, so the final result
            // must remain on a 0–100 scale.
            setScore(previous =>
                Number(
                    (
                        previous +
                        (result.score / Math.max(1, activity.items.length))
                    ).toFixed(2)
                )
            );
            setChecked(true);
            if (itemIndex >= activity.items.length - 1) {
                // An exercise session represents the complete set of
                // handwriting activities, not one individual activity.
                // Keep the session open until all activities have been
                // completed at least once.
                try {
                    const sessionResponse =
                        await ExerciseService.getSession(sessionId);

                    const savedAttempts =
                        sessionResponse?.data?.attempts || [];

                    const completedActivityIds = new Set();

                    savedAttempts.forEach(attempt => {
                        let meta = {};

                        try {
                            meta =
                                typeof attempt.stroke_data === "string"
                                    ? JSON.parse(attempt.stroke_data)
                                    : attempt.stroke_data || {};
                        } catch {
                            meta = {};
                        }

                        if (meta.activityId) {
                            completedActivityIds.add(
                                String(meta.activityId)
                            );
                        }
                    });

                    // Include the activity that was just saved even if
                    // the response has not yet been refreshed.
                    completedActivityIds.add(String(activity.id));

                    const requiredActivityIds =
                        new Set(
                            exerciseData
                                .map(item => item?.id)
                                .filter(Boolean)
                                .map(id => String(id))
                        );

                    const allActivitiesCompleted =
                        requiredActivityIds.size > 0 &&
                        [...requiredActivityIds].every(id =>
                            completedActivityIds.has(id)
                        );

                    if (allActivitiesCompleted) {
                        await ExerciseService.completeSession(sessionId);
                    }
                } catch (sessionError) {
                    console.error(
                        "Final exercise-session calculation failed:",
                        sessionError
                    );
                }

                setCompleted(true);
                return;
            }
            setTimeout(() => {
                setItemIndex(previous => previous + 1);
                setChecked(false); setLastResult(null);
                itemStartedAtRef.current = Date.now();
                canvasRef.current?.clear?.();
            }, 900);
        } catch (error) {
            console.error("Save exercise attempt failed:", error);
            alert(error?.response?.data?.message || error?.message || "Unable to save this activity. Please try again.");
        } finally { setSavingAttempt(false); }
    };


    // ==========================================
    // Back to Activities
    // ==========================================

    const handleBackToActivities = () => {

        setShowActivities(
            true
        );

        setCompleted(
            false
        );

    };


    // ==========================================
    // ACTIVITY LIBRARY
    // ==========================================

    if (
        showActivities
    ) {

        return (

            <div
                className="
                    min-h-screen
                    bg-sky-50
                    px-6
                    py-10
                "
            >

                <div
                    className="
                        max-w-7xl
                        mx-auto
                    "
                >

                    <button
                        onClick={() =>
                            navigate(
                                "/student-selection"
                            )
                        }

                        className="
                            flex
                            items-center
                            gap-2
                            mb-8
                            text-slate-600
                            font-bold
                        "
                    >

                        <ArrowLeft size={22} />

                        Back

                    </button>


                    <div
                        className="
                            text-center
                            mb-12
                        "
                    >

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-full
                                bg-sky-100
                                text-sky-700
                                font-black
                                text-xs
                                uppercase
                                tracking-widest
                            "
                        >

                            <Sparkles size={16} />

                            KineWrite Activities

                        </div>


                        <h1
                            className="
                                mt-5
                                sm:text-5xl text-4xl
                                font-black
                                text-slate-800
                            "
                        >
                            Handwriting Activities
                        </h1>


                        <p
                            className="
                                mt-4
                                text-lg
                                text-slate-500
                            "
                        >
                            Practice handwriting through
                            different activities and challenges.
                        </p>

                    </div>


                    {/* ===================================== */}
                    {/* GROUP BY CATEGORY */}
                    {/* ===================================== */}

                    {[
                        "spacing",
                        "alignment",
                        "stroke",
                    ].map(
                        category => {

                            const activities =
                                exerciseData.filter(
                                    item =>
                                        item.category ===
                                        category
                                );


                            return (

                                <section
                                    key={category}
                                    className="
                                        mb-12
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-4
                                            mb-6
                                        "
                                    >

                                        <span
                                            className={`
                                                px-4
                                                py-2
                                                rounded-full
                                                text-sm
                                                font-black
                                                uppercase
                                                tracking-widest
                                                ${categoryClasses[category]}
                                            `}
                                        >
                                            {
                                                categoryNames[
                                                    category
                                                ]
                                            }
                                        </span>


                                        <div
                                            className="
                                                flex-1
                                                h-px
                                                bg-slate-200
                                            "
                                        />

                                    </div>


                                    <div
                                        className="
                                            grid
                                            md:grid-cols-2
                                            lg:grid-cols-3
                                            gap-6
                                        "
                                    >

                                        {activities.map(
                                            (
                                                item,
                                                index
                                            ) => {

                                                const progress =
                                                    getActivityProgress(
                                                        item,
                                                        exerciseHistory
                                                    );

                                                return (

                                                    <button
                                                        key={item.id}
                                                        onClick={() =>
                                                            selectActivity(item)
                                                        }
                                                        className="
                                                            text-left
                                                            bg-white
                                                            rounded-[30px]
                                                            shadow-xl
                                                            sm:p-7 p-5
                                                            border-4
                                                            border-transparent
                                                            hover:border-sky-400
                                                            hover:-translate-y-1
                                                            transition-all
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                justify-between
                                                            "
                                                        >

                                                            <span
                                                                className="
                                                                    text-xs
                                                                    font-black
                                                                    uppercase
                                                                    tracking-widest
                                                                "
                                                                style={{
                                                                    color:
                                                                        item.themeColor,
                                                                }}
                                                            >
                                                                Activity {index + 1}
                                                            </span>


                                                            {progress.completed ? (

                                                                <span
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        gap-1
                                                                        px-3
                                                                        py-1.5
                                                                        rounded-full
                                                                        bg-green-100
                                                                        text-green-700
                                                                        text-xs
                                                                        font-black
                                                                    "
                                                                >

                                                                    <CheckCircle2
                                                                        size={15}
                                                                    />

                                                                    Completed

                                                                </span>

                                                            ) : (

                                                                <Star
                                                                    size={24}
                                                                    className="
                                                                        text-yellow-400
                                                                        fill-yellow-400
                                                                    "
                                                                />

                                                            )}

                                                        </div>


                                                        <h2
                                                            className="
                                                                mt-4
                                                                text-2xl
                                                                font-black
                                                                text-slate-800
                                                            "
                                                        >
                                                            {item.title}
                                                        </h2>


                                                        <p
                                                            className="
                                                                mt-3
                                                                text-slate-500
                                                                leading-7
                                                            "
                                                        >
                                                            {item.description}
                                                        </p>


                                                        <div
                                                            className="
                                                                mt-6
                                                                flex
                                                                justify-between
                                                                items-end
                                                                gap-4
                                                                h-9
                                                            "
                                                        >

                                                            <div>

                                                                {progress.completed ? (

                                                                    <>

                                                                        <div
                                                                            className="
                                                                                text-xs
                                                                                font-black
                                                                                uppercase
                                                                                tracking-widest
                                                                                text-slate-400
                                                                            "
                                                                        >
                                                                            Score / Accuracy
                                                                        </div>

                                                                        <div
                                                                            className="
                                                                                text-xl
                                                                                font-black
                                                                                text-green-600
                                                                            "
                                                                        >
                                                                            {progress.score !== null
                                                                                ? `${progress.score}%`
                                                                                : "Completed"}
                                                                        </div>

                                                                    </>

                                                                ) : (

                                                                    <span
                                                                        className="
                                                                            text-sm
                                                                            font-bold
                                                                            text-slate-400
                                                                        "
                                                                    >
                                                                        Not completed
                                                                    </span>

                                                                )}

                                                            </div>


                                                            <span
                                                                className="
                                                                    font-black
                                                                    text-sky-500
                                                                    whitespace-nowrap
                                                                "
                                                            >
                                                                {progress.completed
                                                                    ? "Practice Again →"
                                                                    : "Start Activity →"}
                                                            </span>

                                                        </div>

                                                    </button>

                                                );

                                            }
                                        )}

                                    </div>

                                </section>

                            );

                        }
                    )}

                    {historyLoading && (
                        <div
                            className="
                                mb-8
                                text-center
                                text-sm
                                font-bold
                                text-slate-400
                            "
                        >
                            Loading student progress...
                        </div>
                    )}

                </div>

            </div>

        );

    }


    // ==========================================
    // No Activity
    // ==========================================

    if (
        !activity ||
        !currentItem
    ) {

        return null;

    }


    // ==========================================
    // COMPLETED
    // ==========================================

    if (completed) {

        return (

            <div
                className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    bg-sky-50
                    px-6
                "
            >

                <div
                    className="
                        max-w-xl
                        w-full
                        bg-white
                        rounded-[40px]
                        shadow-2xl
                        p-12
                        text-center
                    "
                >

                    <Trophy
                        size={90}
                        className="
                            mx-auto
                            text-yellow-500
                        "
                    />


                    <h1
                        className="
                            mt-6
                            text-4xl
                            font-black
                            text-slate-800
                        "
                    >
                        Great Job!
                    </h1>


                    <p
                        className="
                            mt-4
                            text-xl
                            text-slate-500
                        "
                    >
                        You completed{" "}
                        {activity.title}.
                    </p>


                    <div
                        className="
                            mt-8
                            text-6xl
                            font-black
                            text-sky-500
                        "
                    >
                        {Number(score).toFixed(2)}/100
                    </div>


                    <div
                        className="
                            mt-8
                            flex
                            gap-4
                            justify-center
                        "
                    >

                        <button
                            onClick={() =>
                                selectActivity(
                                    activity
                                )
                            }

                            className="
                                flex
                                items-center
                                gap-2
                                px-6
                                py-4
                                rounded-2xl
                                bg-slate-100
                                font-bold
                            "
                        >

                            <RotateCcw size={20} />

                            Try Again

                        </button>


                        <button
                            onClick={
                                handleBackToActivities
                            }

                            className="
                                flex
                                items-center
                                gap-2
                                px-6
                                py-4
                                rounded-2xl
                                bg-sky-500
                                text-white
                                font-bold
                            "
                        >

                            More Activities

                            <ArrowRight size={20} />

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // ==========================================
    // ACTIVITY GAME
    // ==========================================

    const mode =
        activity.mode;


    const category =
        activity.category;


    const isTracing =
        mode === "trace-line" ||
        mode === "trace-shape" ||
        mode === "trace-letter";


    const isSpacing =
        category === "spacing";


    const isAlignment =
        category === "alignment";


    const isStroke =
        category === "stroke";


    return (

        <div
            className="
                min-h-screen
                bg-sky-50
                px-5
                py-8
            "
        >

            <div
                className="
                    max-w-7xl
                    mx-auto
                "
            >

                {/* ===================================== */}
                {/* HEADER */}
                {/* ===================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        mb-6
                    "
                >

                    <button
                        onClick={
                            handleBackToActivities
                        }

                        className="
                            flex
                            items-center
                            gap-2
                            font-bold
                            text-slate-600
                        "
                    >

                        <ArrowLeft size={22} />

                        Activities

                    </button>


                    <div
                        className="
                            text-center
                        "
                    >

                        <span
                            className={`
                                inline-block
                                px-4
                                py-1.5
                                rounded-full
                                text-xs
                                font-black
                                uppercase
                                tracking-widest
                                ${categoryClasses[category]}
                            `}
                        >
                            {categoryNames[category]}
                        </span>


                        <h1
                            className="
                                mt-2
                                text-3xl
                                font-black
                                text-slate-800
                            "
                        >
                            {modeTitles[mode] ||
                                activity.title}
                        </h1>

                    </div>


                    <div
                        className="
                            rounded-full
                            bg-white
                            shadow
                            px-5
                            py-3
                            font-black
                            text-sky-600
                        "
                    >

                        {itemIndex + 1}
                        {" / "}
                        {activity.items.length}

                    </div>

                </div>


                {/* ===================================== */}
                {/* PROGRESS */}
                {/* ===================================== */}

                <div
                    className="
                        h-3
                        bg-slate-200
                        rounded-full
                        overflow-hidden
                        mb-7
                    "
                >

                    <div
                        className="
                            h-full
                            bg-sky-500
                            transition-all
                        "
                        style={{
                            width:
                                `${
                                    (
                                        itemIndex /
                                        activity.items.length
                                    ) *
                                    100
                                }%`,
                        }}
                    />

                </div>


                {/* ===================================== */}
                {/* GAME INSTRUCTION */}
                {/* ===================================== */}

                <div
                    className={`
                        rounded-[30px]
                        p-6
                        mb-6
                        shadow-lg
                        border
                        ${
                            isSpacing
                                ? "bg-blue-50 border-blue-100"
                                : isAlignment
                                    ? "bg-orange-50 border-orange-100"
                                    : "bg-green-50 border-green-100"
                        }
                    `}
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-center
                            gap-3
                        "
                    >

                        <Sparkles
                            size={22}
                            className={
                                isSpacing
                                    ? "text-blue-500"
                                    : isAlignment
                                        ? "text-orange-500"
                                        : "text-green-500"
                            }
                        />


                        <p
                            className="
                                text-lg
                                md:text-xl
                                font-bold
                                text-slate-700
                                text-center
                            "
                        >
                            {getInstruction(activity)}
                        </p>

                    </div>

                </div>


                {/* ===================================== */}
                {/* MODEL / CHALLENGE */}
                {/* ===================================== */}

                {!hideStrokeModel && (

                <div
                    className="
                        bg-white
                        rounded-[35px]
                        shadow-xl
                        p-7
                        mb-7
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            mb-5
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
                                {isTracing
                                    ? "Trace Guide"
                                    : isSpacing
                                        ? "Writing Model"
                                        : "Target"}
                            </div>


                            <h2
                                className="
                                    mt-1
                                    text-2xl
                                    font-black
                                    text-slate-800
                                "
                            >
                                {modeTitles[mode] ||
                                    activity.title}
                            </h2>

                        </div>


                        <div
                            className="
                                px-4
                                py-2
                                rounded-full
                                bg-slate-100
                                text-slate-500
                                font-black
                                text-sm
                            "
                        >
                            Item {itemIndex + 1}
                        </div>

                    </div>


                    {/* ================================= */}
                    {/* SPACING MODEL */}
                    {/* ================================= */}

                    {isSpacing && (

                        <div
                            className="
                                rounded-3xl
                                bg-blue-50
                                border-2
                                border-blue-100
                                p-8
                                text-center
                            "
                        >

                            <div
                                className="
                                    text-6xl
                                    md:text-7xl
                                    font-black
                                    tracking-wide
                                    text-slate-700
                                    break-words
                                "
                            >
                                {currentItem.promptText}
                            </div>


                            {mode ===
                                "spacing-challenge" && (

                                <div
                                    className="
                                        mt-4
                                        text-sm
                                        font-bold
                                        text-blue-500
                                    "
                                >
                                    Rewrite this with the
                                    correct spaces.
                                </div>

                            )}

                        </div>

                    )}


                    {/* ================================= */}
                    {/* ALIGNMENT MODEL */}
                    {/* ================================= */}

                    {isAlignment && (

                        <div
                            className="
                                rounded-3xl
                                bg-orange-50
                                border-2
                                border-orange-100
                                p-8
                                relative
                                overflow-hidden
                                min-h-[190px]
                                flex
                                items-center
                                justify-center
                            "
                        >

                            {mode ===
                                "stay-box" && (

                                <div
                                    className="
                                        absolute
                                        inset-6
                                        border-4
                                        border-dashed
                                        border-orange-300
                                        rounded-2xl
                                    "
                                />

                            )}


                            {mode ===
                                "alignment-path" && (

                                <svg
                                    className="
                                        absolute
                                        inset-0
                                        w-full
                                        h-full
                                    "
                                    viewBox="0 0 1000 220"
                                    preserveAspectRatio="none"
                                >

                                    <path
                                        d="
                                            M 60 130
                                            C 220 60,
                                            330 190,
                                            480 115
                                            S 740 60,
                                            940 130
                                        "
                                        fill="none"
                                        stroke="#fdba74"
                                        strokeWidth="9"
                                        strokeDasharray="18 12"
                                    />

                                </svg>

                            )}


                            {mode !==
                                "alignment-path" && (

                                <div
                                    className="
                                        absolute
                                        left-10
                                        right-10
                                        bottom-10
                                        border-b-4
                                        border-orange-300
                                    "
                                />

                            )}


                            <div
                                className="
                                    relative
                                    z-10
                                    text-5xl
                                    md:text-6xl
                                    font-black
                                    text-slate-700
                                "
                            >
                                {currentItem.promptText}
                            </div>

                        </div>

                    )}


                    {/* ================================= */}
                    {/* STROKE MODEL */}
                    {/* ================================= */}

                    {isStroke && (

                        <div
                            className="
                                rounded-3xl
                                bg-green-50
                                border-2
                                border-green-100
                                p-6
                                min-h-[250px]
                                relative
                                overflow-hidden
                            "
                        >

                            <ExerciseGuide
                                mode={
                                    mode
                                }

                                prompt={
                                    currentItem.promptText
                                }
                            />


                            {(
                                mode ===
                                    "write-letter" ||
                                mode ===
                                    "stroke-challenge"
                            ) && (

                                <div
                                    className="
                                        absolute
                                        inset-0
                                        flex
                                        items-center
                                        justify-center
                                        pointer-events-none
                                    "
                                >

                                    <span
                                        className="
                                            text-7xl
                                            md:text-8xl
                                            font-black
                                            text-green-700
                                        "
                                    >
                                        {
                                            currentItem.promptText
                                        }
                                    </span>

                                </div>

                            )}

                        </div>

                    )}

                </div>

                )}


                {/* ===================================== */}
                {/* WRITING AREA */}
                {/* ===================================== */}

                <div
                    className="
                        bg-white
                        rounded-[40px]
                        shadow-2xl
                        p-4
                    "
                >

                    <div
                        className="
                            rounded-[32px]
                            overflow-hidden
                            border-4
                            border-slate-100
                        "
                    >

                    <HandwritingWorksheet
                        key={`${activity.id}-${itemIndex}`}
                        ref={canvasRef}
                        activity={{
                            ...activity,

                            activityName:
                                activity.title,

                            promptText:
                                currentItem.promptText,

                            showGuide:
                                activity.category === "stroke" &&
                                (
                                    activity.mode === "trace-line" ||
                                    activity.mode === "trace-shape" ||
                                    activity.mode === "trace-letter"
                                ),

                            canvasGuide:
                                activity.category === "alignment"
                                    ? getAlignmentGuide(
                                        activity.mode,
                                        itemIndex
                                    )
                                    : null,
                        }}
                    />

                    </div>

                </div>


                {/* ===================================== */}
                {/* TOOLBAR */}
                {/* ===================================== */}

                <div
                    className="
                        mt-6
                        flex
                        justify-center
                    "
                >

                    <HandwritingToolbar

                        onClear={
                            handleClear
                        }

                        onCheck={
                            handleCheck
                        }

                        disableCheck={
                            checked || savingAttempt
                        }

                    />

                </div>


                {/* ===================================== */}
                {/* FEEDBACK */}
                {/* ===================================== */}

                {checked && (

                    <div
                        className="
                            mt-6
                            bg-green-50
                            border
                            border-green-200
                            rounded-3xl
                            p-5
                            text-center
                        "
                    >

                        <CheckCircle2
                            size={32}
                            className="
                                mx-auto
                                text-green-500
                            "
                        />


                        <p
                            className="
                                mt-2
                                text-xl
                                font-black
                                text-green-700
                            "
                        >
                            {lastResult ? `${lastResult.score}% — ${lastResult.stars} star${lastResult.stars === 1 ? "" : "s"}` : "Great work!"}
                        </p>


                        <p
                            className="
                                mt-1
                                text-slate-500
                            "
                        >
                            {completed ? "Activity complete!" : "Moving to the next item..."}
                        </p>

                    </div>

                )}

            </div>

        </div>

    );

};


export default Exercises;