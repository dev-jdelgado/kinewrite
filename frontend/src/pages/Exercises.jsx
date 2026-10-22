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

import {
    renderSingleStrokeWord,
} from "../utils/handwritingGuides";


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
    itemIndex,
    promptText
) => {

    if (mode === "write-line") {
        return (
            <div className="absolute inset-0 pointer-events-none z-0">

                {/* Top blue guide */}
                <div
                    className="
                        absolute
                        left-[8%]
                        right-[8%]
                        border-b-2
                        border-blue-300
                        top-[35%]
                        sm:top-[32%]
                        md:top-[28%]
                    "
                />

                {/* Middle red baseline */}
                <div
                    className="
                        absolute
                        left-[8%]
                        right-[8%]
                        border-b-2
                        border-red-400
                        top-[50%]
                    "
                />

                {/* Bottom blue guide */}
                <div
                    className="
                        absolute
                        left-[8%]
                        right-[8%]
                        border-b-2
                        border-blue-300
                        top-[65%]
                        sm:top-[68%]
                        md:top-[72%]
                    "
                />

            </div>
        );
    }

    if (
        mode === "complete-sentence" ||
        mode === "copy-sentence" ||
        mode === "copy-phrase"
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

                {/* Top blue guide */}
                <div
                    className="
                        absolute
                        left-[8%]
                        right-[8%]
                        border-b-2
                        border-blue-300
                        top-[35%]
                        sm:top-[32%]
                        md:top-[28%]
                    "
                />

                {/* Middle red baseline */}
                <div
                    className="
                        absolute
                        left-[8%]
                        right-[8%]
                        border-b-2
                        border-red-400
                        top-[50%]
                    "
                />

                {/* Bottom blue guide */}
                <div
                    className="
                        absolute
                        left-[8%]
                        right-[8%]
                        border-b-2
                        border-blue-300
                        top-[65%]
                        sm:top-[68%]
                        md:top-[72%]
                    "
                />

            </div>
        );

    }

    if (mode === "trace-letter") {

        const prompt =
            String(promptText || "");

        /*
         * Responsive guide area
         *
         * Same responsive height as Follow the Writing Line.
         */
        const isMobile =
            typeof window !== "undefined" &&
            window.innerWidth < 640;

        const isSmall =
            typeof window !== "undefined" &&
            window.innerWidth >= 640 &&
            window.innerWidth < 768;


        const guideHeight =
            isMobile
                ? 30
                : isSmall
                    ? 36
                    : 44;

        const guideTop =
            isMobile
                ? 35
                : isSmall
                    ? 32
                    : 28;


        /*
         * Normalized SVG coordinate system.
         */
        const SVG_WIDTH = 1000;


        /*
         * The letter occupies the complete
         * height of the responsive guide.
         */
        const letterHeight = 100;
        const topY = 0;


        /*
         * Letter dimensions follow the
         * responsive guide height.
         */
        const letterWidth =
            guideHeight * 2.2;

        const letterSpacing =
            guideHeight * 0.0;


        /*
         * Calculate natural word width.
         */
        const naturalWordWidth =
            prompt
                .split("")
                .reduce(
                    (total, character) => {

                        if (character === " ") {
                            return total +
                                letterWidth * 0.55;
                        }

                        return total +
                            letterWidth +
                            letterSpacing;

                    },
                    0
                );


        /*
         * Keep the word inside the writing area.
         */
        const maxWordWidth =
            SVG_WIDTH * 0.84;


        const wordScale =
            naturalWordWidth > maxWordWidth
                ? maxWordWidth / naturalWordWidth
                : 1;


        const finalLetterWidth =
            letterWidth * wordScale;

        const finalLetterSpacing =
            letterSpacing * wordScale;


        /*
         * Calculate final word width.
         */
        const finalWordWidth =
            prompt
                .split("")
                .reduce(
                    (total, character) => {

                        if (character === " ") {
                            return total +
                                finalLetterWidth * 0.55;
                        }

                        return total +
                            finalLetterWidth +
                            finalLetterSpacing;

                    },
                    0
                );


        /*
         * Center the guide.
         */
        const startX =
            Math.max(
                40,
                (SVG_WIDTH - finalWordWidth) / 2
            );


        /*
         * Responsive dotted stroke.
         */
        const guideStrokeWidth =
            Math.max(
                2,
                Math.min(
                    4.6,
                    guideHeight * 0.12
                )
            );


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

                {/* RESPONSIVE SINGLE-STROKE LETTER GUIDE */}
                <svg
                    className="
                        absolute
                        left-0
                        top-[35%]
                        w-full
                        h-[30%]
                        pointer-events-none
                        overflow-visible
                        sm:top-[32%]
                        sm:h-[36%]
                        md:top-[28%]
                        md:h-[44%]
                    "
                    viewBox="0 0 1000 100"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <defs>
                        <marker id="kinewrite-motion-arrow" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                            <path d="M0,0 L10,5 L0,10 Z" fill="#16a34a" />
                        </marker>
                    </defs>
                    {renderSingleStrokeWord(
                        prompt,
                        {
                            startX,
                            topY,
                            letterHeight,
                            letterWidth: finalLetterWidth,
                            spacing: finalLetterSpacing,
                            strokeWidth: guideStrokeWidth,
                        }
                    )}

                </svg>

            </div>
        );
    }

    if (mode === "follow-line") {

        const prompt =
            String(promptText || "");

        /*
         * SVG coordinate system
         */
        const SVG_WIDTH = 1000;
        const SVG_HEIGHT = 300;


        /*
         * Responsive writing-line positions
         */
        const isMobile =
            typeof window !== "undefined" &&
            window.innerWidth < 640;

        const isSmall =
            typeof window !== "undefined" &&
            window.innerWidth >= 640 &&
            window.innerWidth < 768;


        const topRatio =
            isMobile
                ? 0.35
                : isSmall
                    ? 0.32
                    : 0.28;

        const bottomRatio =
            isMobile
                ? 0.65
                : isSmall
                    ? 0.68
                    : 0.72;


        /*
         * Convert responsive percentages
         * into SVG coordinates.
         */
        const topLineY =
            SVG_HEIGHT * topRatio;

        const bottomLineY =
            SVG_HEIGHT * bottomRatio;


        /*
         * THIS is the actual height available
         * for the letters.
         */
        const letterHeight =
            bottomLineY - topLineY;


        /*
         * Letter starts exactly at the
         * top blue writing line.
         */
        const topY =
            topLineY;


        /*
         * Letter width follows letter height.
         *
         * This keeps the letters proportional.
         */
        const letterWidth =
            letterHeight * 0.92;

        const letterSpacing =
            letterHeight * 0.12;


        /*
         * Calculate natural word width.
         */
        const naturalWordWidth =
            prompt
                .split("")
                .reduce(
                    (total, character) => {

                        if (character === " ") {
                            return total +
                                letterWidth * 0.55;
                        }

                        return total +
                            letterWidth +
                            letterSpacing;

                    },
                    0
                );


        /*
         * Maximum available width.
         */
        const maxWordWidth =
            SVG_WIDTH * 0.84;


        /*
         * Only scale if the word is actually
         * too wide to fit.
         */
        const wordScale =
            naturalWordWidth > maxWordWidth
                ? maxWordWidth / naturalWordWidth
                : 1;


        /*
         * IMPORTANT:
         *
         * Do NOT scale letterHeight here.
         *
         * Only width is adjusted when necessary.
         */
        const finalLetterWidth =
            letterWidth * wordScale;

        const finalLetterSpacing =
            letterSpacing * wordScale;


        /*
         * Calculate final word width.
         */
        const finalWordWidth =
            prompt
                .split("")
                .reduce(
                    (total, character) => {

                        if (character === " ") {
                            return total +
                                finalLetterWidth * 0.55;
                        }

                        return total +
                            finalLetterWidth +
                            finalLetterSpacing;

                    },
                    0
                );


        /*
         * Center the word.
         */
        const startX =
            Math.max(
                40,
                (SVG_WIDTH - finalWordWidth) / 2
            );


        /*
         * Stroke width follows the
         * responsive letter height.
         */
        const guideStrokeWidth =
            Math.max(
                2,
                Math.min(
                    4.6,
                    letterHeight * 0.045
                )
            );


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

                {/* TOP BLUE WRITING LINE */}
                <div
                    className="
                        absolute
                        left-[8%]
                        right-[8%]
                        border-b-2
                        border-blue-300
                        top-[35%]
                        sm:top-[32%]
                        md:top-[28%]
                    "
                />


                {/* RED BASELINE */}
                <div
                    className="
                        absolute
                        left-[8%]
                        right-[8%]
                        border-b-2
                        border-red-400
                        top-[50%]
                    "
                />


                {/* BOTTOM BLUE WRITING LINE */}
                <div
                    className="
                        absolute
                        left-[8%]
                        right-[8%]
                        border-b-2
                        border-blue-300
                        top-[65%]
                        sm:top-[68%]
                        md:top-[72%]
                    "
                />


                {/* SINGLE-STROKE DOTTED LETTER GUIDE */}
                <svg
                    className="
                            absolute
                            left-0
                            top-[35%]
                            w-full
                            h-[30%]
                            pointer-events-none
                            overflow-visible
                            sm:top-[32%]
                            sm:h-[36%]
                            md:top-[28%]
                            md:h-[44%]
                        "
                    viewBox="0 0 1000 100"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <marker id="kinewrite-motion-arrow" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                            <path d="M0,0 L10,5 L0,10 Z" fill="#16a34a" />
                        </marker>
                    </defs>
                    {renderSingleStrokeWord(
                        prompt,
                        {
                            startX,
                            topY: 0,
                            letterHeight: 100,
                            letterWidth: finalLetterWidth,
                            spacing: finalLetterSpacing,
                            strokeWidth: guideStrokeWidth,
                        }
                    )}

                </svg>

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
    history,
    studentId
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

    const totalItems =
        Array.isArray(activity?.items) && activity.items.length > 0
            ? Math.min(5, activity.items.length)
            : 0;

    /*
     * Count unique completed items.
     *
     * Each attempt already stores itemNo inside
     * stroke_data, so we can determine exactly how
     * many items have been completed.
     */
    const completedItemNumbers =
        new Set();

    attempts.forEach(attempt => {

        let meta = {};

        try {
            meta =
                typeof attempt.stroke_data === "string"
                    ? JSON.parse(attempt.stroke_data)
                    : attempt.stroke_data || {};
        } catch {
            meta = {};
        }

        if (
            meta.itemNo !== undefined &&
            meta.itemNo !== null
        ) {
            completedItemNumbers.add(
                String(meta.itemNo)
            );
        }

    });

    /*
     * Fallback for older attempts that may not have
     * itemNo stored in stroke_data.
     *
     * In that case, count the attempts themselves,
     * but never exceed the number of activity items.
     */
    const completedCount =
        completedItemNumbers.size > 0
            ? Math.min(
                completedItemNumbers.size,
                totalItems
            )
            : Math.min(
                attempts.length,
                totalItems
            );

    // An activity is only fully completed after Hard is finished.
    // Completing Easy or Medium must not mark the activity Completed.
    const difficultyKey = getDifficultyKey(studentId, activity.id);
    const finishedKey = `kinewrite-exercise-finished-${studentId}-${activity.id}`;
    const difficultyIndex = Math.min(
        2,
        Math.max(0, Number(localStorage.getItem(difficultyKey)) || 0)
    );
    const finishedAllDifficulties =
        localStorage.getItem(finishedKey) === "true";

    const isCompleted = finishedAllDifficulties;
    const isOngoing = !isCompleted && (
        attempts.length > 0 || difficultyIndex > 0
    );

    // Show live progress across all 3 levels (5 items per level).
    // The saved in-progress itemIndex represents items already completed
    // in the current difficulty, so include it before the difficulty is finished.
    const displayTotalItems = 15;
    const progressKey = `kinewrite-exercise-progress-${studentId}-${activity.id}`;
    let currentLevelCompleted = 0;

    try {
        // Read the current saved attempt so card progress updates item-by-item.
        // forceDifficulty is only an argument to selectActivity, not this helper.
        const savedProgress = localStorage.getItem(progressKey);
        if (savedProgress) {
            const parsedProgress = JSON.parse(savedProgress);
            const savedDifficultyIndex = DIFFICULTY_LEVELS.indexOf(
                parsedProgress.difficulty
            );

            if (savedDifficultyIndex >= 0) {
                const savedItemIndex = Math.max(
                    0,
                    Math.min(5, Number(parsedProgress.itemIndex) || 0)
                );
                currentLevelCompleted = savedDifficultyIndex * 5 + savedItemIndex;
            }
        }
    } catch (error) {
        console.warn("Unable to read saved exercise progress:", error);
    }

    const displayCompletedCount = Math.min(
        displayTotalItems - 1,
        Math.max(completedCount, difficultyIndex * 5, currentLevelCompleted)
    );

    /*
     * Accuracy is only relevant/displayed after all three
     * difficulty levels have been completed.
     */
    if (!isCompleted) {
        return {
            completed: false,
            ongoing: isOngoing,
            completedCount: displayCompletedCount,
            totalItems: displayTotalItems,
            score: null,
        };
    }

    const scores = attempts
        .map(attempt =>
            Number(attempt.accuracy)
        )
        .filter(score =>
            Number.isFinite(score)
        );

    if (!scores.length) {
        return {
            completed: true,
            ongoing: false,
            completedCount: displayTotalItems,
            totalItems: displayTotalItems,
            score: null,
        };
    }

    const average =
        scores.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / scores.length;

    return {
        completed: true,
        ongoing: false,
        completedCount: displayTotalItems,
        totalItems: displayTotalItems,
        score: Number(
            average.toFixed(2)
        ),
    };

};

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];

const getDifficultyKey = (studentId, activityId) =>
    `kinewrite-exercise-difficulty-${studentId}-${activityId}`;

const randomizePromptCase = (item) => {
    const original = String(item?.promptText ?? "");
    const hasLetters = /[A-Za-z]/.test(original);
    if (!hasLetters) return { ...item };
    const promptText = Math.random() < 0.5
        ? original.toLowerCase()
        : original.toUpperCase();
    return { ...item, promptText, randomizedCase: promptText === promptText.toLowerCase() ? "lowercase" : "uppercase" };
};

const getAttemptItems = (activity, difficulty) => {
    const allItems = Array.isArray(activity?.items) ? activity.items : [];
    if (allItems.length <= 5) {
        return allItems.map((item, index) => ({
            ...randomizePromptCase(item),
            sourceItemNo: item.itemNo ?? index + 1,
            itemNo: index + 1,
        }));
    }

    // The sentence activity has 90 prompts: 30 per difficulty (15 uppercase + 15 lowercase).
    // Other long activities retain the original 45-prompt structure (15 per difficulty).
    // Shuffle each selected difficulty bank and take five, so letter case is randomized per item.
    let pool;
    if (allItems.length >= 90 && activity?.mode === "copy-sentence") {
        const startByDifficulty = { Easy: 0, Medium: 30, Hard: 60 };
        const start = startByDifficulty[difficulty] ?? 0;
        pool = allItems.slice(start, start + 30);
    } else if (allItems.length >= 45) {
        const startByDifficulty = { Easy: 0, Medium: 15, Hard: 30 };
        const start = startByDifficulty[difficulty] ?? 0;
        pool = allItems.slice(start, start + 15);
    } else {
        // Existing shorter activities retain their established difficulty pools.
        const startByDifficulty = {
            Easy: 0,
            Medium: Math.max(0, allItems.length - 8),
            Hard: Math.max(0, allItems.length - 6),
        };
        const start = startByDifficulty[difficulty] ?? 0;
        pool = allItems.slice(start, Math.min(allItems.length, start + 7));
    }

    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 5).map((item, index) => ({
        ...randomizePromptCase(item),
        sourceItemNo: item.itemNo ?? index + 1,
        itemNo: index + 1,
    }));
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

    const initialActivity = location.state?.activity || null;
    const initialDifficulty = initialActivity
        ? DIFFICULTY_LEVELS[
            Math.min(2, Math.max(0, Number(localStorage.getItem(
                getDifficultyKey(studentId, initialActivity.id)
            )) || 0))
        ]
        : "Easy";

    const [activity, setActivity] =
        useState(initialActivity);

    const [itemIndex, setItemIndex] =
        useState(0);

    const [attemptItems, setAttemptItems] = useState(
        initialActivity ? getAttemptItems(initialActivity, initialDifficulty) : []
    );
    const [difficulty, setDifficulty] = useState(initialDifficulty);
    const [attemptRunId, setAttemptRunId] = useState(
        () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    );

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
    const [difficultyPickerActivity, setDifficultyPickerActivity] = useState(null);

    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const getActivityProgressKey = (activityId) =>
        `kinewrite-exercise-progress-${studentId}-${activityId}`;
    
    const saveActivityProgress = (
        activityId,
        nextItemIndex,
        currentScore,
        items = attemptItems,
        currentDifficulty = difficulty,
        runId = attemptRunId
    ) => {
        if (!studentId || !activityId) return;
    
        localStorage.setItem(
            getActivityProgressKey(activityId),
            JSON.stringify({
                itemIndex: nextItemIndex,
                score: Number(currentScore) || 0,
                items,
                difficulty: currentDifficulty,
                attemptRunId: runId,
            })
        );
    };
    
    const clearActivityProgress = (activityId) => {
        if (!studentId || !activityId) return;
    
        localStorage.removeItem(
            getActivityProgressKey(activityId)
        );
    };

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
        attemptItems?.[itemIndex];

    const displayPromptText = currentItem
        ? String(currentItem.promptText ?? "")
        : "";

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

    const selectActivity = (selected, forceDifficulty = null) => {
        const progressKey = getActivityProgressKey(selected.id);
        const difficultyKey = getDifficultyKey(studentId, selected.id);
        let savedItemIndex = 0;
        let savedScore = 0;
        let savedItems = null;
        let selectedDifficulty = forceDifficulty || DIFFICULTY_LEVELS[
            Math.min(2, Math.max(0, Number(localStorage.getItem(difficultyKey)) || 0))
        ];
        let runId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

        const savedProgress = forceDifficulty
            ? null
            : localStorage.getItem(progressKey);
        if (savedProgress) {
            try {
                const parsed = JSON.parse(savedProgress);
                if (Number.isInteger(parsed.itemIndex)) {
                    savedItemIndex = Math.max(0, Math.min(parsed.itemIndex, 4));
                }
                if (Number.isFinite(Number(parsed.score))) {
                    savedScore = Number(parsed.score);
                }
                if (Array.isArray(parsed.items) && parsed.items.length > 0) {
                    savedItems = parsed.items;
                }
                if (DIFFICULTY_LEVELS.includes(parsed.difficulty)) {
                    selectedDifficulty = parsed.difficulty;
                }
                if (parsed.attemptRunId) runId = parsed.attemptRunId;
            } catch {
                savedItemIndex = 0;
                savedScore = 0;
            }
        }

        if (forceDifficulty) {
            localStorage.setItem(
                difficultyKey,
                String(DIFFICULTY_LEVELS.indexOf(forceDifficulty))
            );
            // A retake starts a fresh five-item run without erasing overall completion.
            localStorage.removeItem(progressKey);
            savedItemIndex = 0;
            savedScore = 0;
            savedItems = null;
            runId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        }

        const selectedItems = savedItems || getAttemptItems(selected, selectedDifficulty);
        setDifficultyPickerActivity(null);
        setActivity(selected);
        setAttemptItems(selectedItems);
        setDifficulty(selectedDifficulty);
        setAttemptRunId(runId);
        setItemIndex(Math.min(savedItemIndex, Math.max(0, selectedItems.length - 1)));
        setScore(savedScore);
        setChecked(false);
        setCompleted(false);
        setShowActivities(false);
        setLastResult(null);
        itemStartedAtRef.current = Date.now();
        ensureExerciseSession().catch(console.error);
        setTimeout(() => canvasRef.current?.clear?.(), 100);
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
                prompt: displayPromptText,
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
                    sourceItemNo: currentItem.sourceItemNo ?? currentItem.itemNo,
                    attemptRunId, difficulty,
                    promptText: displayPromptText, metrics: result.metrics, score: result.score,
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
                        (result.score / Math.max(1, attemptItems.length))
                    ).toFixed(2)
                )
            );
            setChecked(true);
            if (itemIndex >= attemptItems.length - 1) {
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

                clearActivityProgress(activity.id);
                const difficultyKey = getDifficultyKey(studentId, activity.id);
                const currentLevelIndex = DIFFICULTY_LEVELS.indexOf(difficulty);
                localStorage.setItem(
                    difficultyKey,
                    String(Math.min(2, Math.max(0, currentLevelIndex + 1)))
                );
                if (difficulty === "Hard") {
                    localStorage.setItem(
                        `kinewrite-exercise-finished-${studentId}-${activity.id}`,
                        "true"
                    );
                }

                setCompleted(true);
                return;
            }
            setTimeout(() => {

                const nextItemIndex =
                    itemIndex + 1;
            
                const nextScore =
                    Number(
                        (
                            score +
                            (
                                result.score /
                                Math.max(
                                    1,
                                    attemptItems.length
                                )
                            )
                        ).toFixed(2)
                    );
            
                setItemIndex(
                    nextItemIndex
                );
            
                setScore(
                    nextScore
                );
            
                saveActivityProgress(
                    activity.id,
                    nextItemIndex,
                    nextScore,
                    attemptItems,
                    difficulty,
                    attemptRunId
                );
            
                setChecked(false);
            
                setLastResult(null);
            
                itemStartedAtRef.current =
                    Date.now();
            
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

        if (
            activity &&
            currentItem
        ) {
    
            saveActivityProgress(
                activity.id,
                itemIndex,
                score,
                attemptItems,
                difficulty,
                attemptRunId
            );
    
        }
    
        setShowActivities(
            true
        );
    
        setCompleted(
            false
        );
    
        setChecked(
            false
        );
    
        setLastResult(
            null
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
                    dark:bg-slate-950
                    px-6
                    py-10
                    transition-colors
                    duration-300
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
                            dark:text-slate-300
                            font-bold
                            transition-colors
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
                                dark:text-white
                            "
                        >
                            Handwriting Activities
                        </h1>


                        <p
                            className="
                                mt-4
                                text-lg
                                text-slate-500
                                dark:text-slate-300
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
                                                dark:bg-slate-700
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
                                                        exerciseHistory,
                                                        studentId
                                                    );

                                                return (

                                                    <button
                                                        key={item.id}
                                                        onClick={() => {
                                                            if (progress.completed) {
                                                                setDifficultyPickerActivity(item);
                                                            } else {
                                                                selectActivity(item);
                                                            }
                                                        }}
                                                        className="
                                                            text-left
                                                            bg-white
                                                            dark:bg-slate-800
                                                            rounded-[30px]
                                                            shadow-xl
                                                            dark:shadow-black/30
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

                                                                ) : progress.ongoing ? (

                                                                <span
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        gap-1
                                                                        px-3
                                                                        py-1.5
                                                                        rounded-full
                                                                        bg-orange-100
                                                                        text-orange-700
                                                                        text-xs
                                                                        font-black
                                                                    "
                                                                >

                                                                    <RotateCcw
                                                                        size={15}
                                                                    />

                                                                    Ongoing

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
                                                                dark:text-white
                                                            "
                                                        >
                                                            {item.title}
                                                        </h2>


                                                        <p
                                                            className="
                                                                mt-3
                                                                text-slate-500
                                                                dark:text-slate-300
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
                                                                            dark:text-slate-500
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

                                                                ) : progress.ongoing ? (

                                                                <>

                                                                    <div
                                                                        className="
                                                                            text-xs
                                                                            font-black
                                                                            uppercase
                                                                            tracking-widest
                                                                            text-slate-400
                                                                            dark:text-slate-500
                                                                        "
                                                                    >
                                                                        Progress
                                                                    </div>

                                                                    <div
                                                                        className="
                                                                            text-xl
                                                                            font-black
                                                                            text-orange-500
                                                                        "
                                                                    >
                                                                        {progress.completedCount} / {progress.totalItems}
                                                                    </div>

                                                                </>

                                                                ) : (

                                                                <span
                                                                    className="
                                                                        text-sm
                                                                        font-bold
                                                                        text-slate-400
                                                                        dark:text-slate-200
                                                                    "
                                                                >
                                                                    Not started
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
                                                                    : progress.ongoing
                                                                        ? "Continue Activity →"
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


                    {difficultyPickerActivity && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                            <div className="w-full max-w-3xl rounded-[36px] border-4 border-sky-400 bg-white p-6 sm:p-10 text-center shadow-2xl dark:bg-slate-800">
                                <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-orange-700">
                                    {categoryNames[difficultyPickerActivity.category]}
                                </span>
                                <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-5xl dark:text-white">
                                    {difficultyPickerActivity.title}
                                </h2>
                                <p className="mx-auto mt-4 max-w-xl text-lg font-semibold text-slate-500 sm:text-2xl dark:text-slate-300">
                                    Choose a difficulty to practice again.
                                </p>
                                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                                    {[
                                        { name: "Easy", color: "bg-lime-500 hover:bg-lime-600" },
                                        { name: "Medium", color: "bg-orange-500 hover:bg-orange-600" },
                                        { name: "Hard", color: "bg-red-500 hover:bg-red-600" },
                                    ].map(level => (
                                        <button
                                            key={level.name}
                                            onClick={() => selectActivity(difficultyPickerActivity, level.name)}
                                            className={`rounded-[28px] px-5 py-6 text-2xl font-medium text-black transition hover:scale-[1.02] ${level.color}`}
                                        >
                                            {level.name}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setDifficultyPickerActivity(null)}
                                    className="mt-6 rounded-xl px-5 py-3 font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
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
                    dark:bg-slate-950
                    px-6
                "
            >

                <div
                    className="
                        max-w-xl
                        w-full
                        bg-white
                        dark:bg-slate-800
                        rounded-[40px]
                        shadow-2xl
                        dark:shadow-black/30
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
                            dark:text-white
                        "
                    >
                        Great Job!
                    </h1>


                    <p
                        className="
                            mt-4
                            text-xl
                            text-slate-500
                            dark:text-slate-300
                        "
                    >
                        You completed{" "}
                        {activity.title} on {difficulty} difficulty.
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
                                dark:bg-slate-700
                                 dark:text-white
                                font-bold
                                hover:bg-slate-200
                                dark:hover:bg-slate-600
                            "
                        >

                            <RotateCcw size={20} />

                            {difficulty === "Easy"
                                ? "Proceed with Medium"
                                : difficulty === "Medium"
                                    ? "Proceed with Hard"
                                    : "Try Again"}

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
                                hover:bg-sky-600
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
                dark:bg-slate-950
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
                            dark:text-slate-300
                            hover:text-slate-900
                            dark:hover:text-white
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
                                dark:text-white
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
                            dark:bg-slate-800
                            shadow
                            dark:shadow-black/30
                            px-5
                            py-3
                            font-black
                            text-sky-600
                        "
                    >

                        {difficulty}{" · "}{itemIndex + 1}{" / "}{attemptItems.length}

                    </div>

                </div>


                {/* ===================================== */}
                {/* PROGRESS */}
                {/* ===================================== */}

                <div
                    className="
                        h-3
                        bg-slate-200
                        dark:bg-slate-700
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
                                `${(
                                    itemIndex /
                                    attemptItems.length
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
                        bg-white
                        dark:bg-slate-800
                        p-6
                        mb-6
                        shadow-lg
                        dark:shadow-black/20
                        border
                        ${isSpacing
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
                                dark:text-slate-200
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
                        dark:bg-slate-800
                        rounded-[35px]
                        shadow-xl
                        dark:shadow-black/30
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
                                    dark:text-slate-500
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
                                    dark:text-white
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
                                dark:bg-slate-700
                                text-slate-500
                                dark:text-slate-200
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
                                dark:bg-blue-950/40
                                border-2
                                border-blue-100
                                dark:border-blue-900
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
                                    dark:text-slate-100
                                    break-words
                                "
                                >
                                    {displayPromptText}
                                </div>


                                {mode ===
                                    "spacing-challenge" && (

                                        <div
                                            className="
                                        mt-4
                                        text-sm
                                        font-bold
                                        text-blue-500
                                        dark:text-blue-400
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
                                dark:bg-orange-950/40
                                border-2
                                border-orange-100
                                dark:border-orange-900
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
                                        dark:border-orange-500
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
                                        dark:border-orange-500
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
                                    dark:text-slate-100
                                "
                                >
                                    {displayPromptText}
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
                                dark:bg-green-950/40
                                border-2
                                border-green-100
                                dark:border-green-900
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
                                        displayPromptText
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
                                            dark:text-green-300
                                        "
                                            >
                                                {
                                                    displayPromptText
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
                        dark:bg-slate-800
                        rounded-[40px]
                        shadow-2xl
                         dark:shadow-black/30
                        p-4
                    "
                >

                    <div
                        className="
                            rounded-[32px]
                            overflow-hidden
                            border-4
                            border-slate-100
                            dark:border-slate-700
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
                                    displayPromptText,

                                showGuide:
                                    activity.category === "stroke" &&
                                    (
                                        activity.mode === "trace-line" ||
                                        activity.mode === "trace-shape"
                                    ),

                                canvasGuide:
                                    (
                                        activity.category === "alignment" ||
                                        (
                                            activity.category === "spacing" &&
                                            (
                                                activity.mode === "complete-sentence" ||
                                                activity.mode === "copy-sentence" ||
                                                activity.mode === "copy-phrase"
                                            )
                                        ) ||
                                        activity.mode === "trace-letter"
                                    )
                                        ? getAlignmentGuide(
                                            activity.mode,
                                            itemIndex,
                                            displayPromptText
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
                            dark:bg-green-950/40
                            border
                            border-green-200
                            dark:border-green-900
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
                                dark:text-green-400
                            "
                        />


                        <p
                            className="
                                mt-2
                                text-xl
                                font-black
                                text-green-700
                                dark:text-green-300
                            "
                        >
                            {lastResult ? `${lastResult.score}% — ${lastResult.stars} star${lastResult.stars === 1 ? "" : "s"}` : "Great work!"}
                        </p>


                        <p
                            className="
                                mt-1
                                text-slate-500
                                dark:text-slate-300
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