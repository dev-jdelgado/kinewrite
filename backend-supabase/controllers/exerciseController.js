const ExerciseSession = require("../models/ExerciseSession");
const ExerciseAttempt = require("../models/ExerciseAttempt");

// Safely parse stroke metadata stored as JSON/text.
const parseStrokeData = (value) => {
    try {
        if (typeof value === "string") {
            return JSON.parse(value);
        }

        return value || {};
    } catch {
        return {};
    }
};

/**
 * Calculate the final session score from activity-level averages.
 *
 * Each handwriting activity may contain multiple item attempts.
 * First calculate the average score of each activity, then average
 * those activity scores. This prevents activities with more items
 * from dominating the final session score.
 */
const calculateSessionSummary = (rows = []) => {
    const activityGroups = new Map();

    rows.forEach((row) => {
        const meta = parseStrokeData(row.stroke_data);

        const activityId =
            meta?.activityId ||
            meta?.activity_id ||
            row.exercise_id ||
            `attempt-${row.attempt_id}`;

        const key = String(activityId);

        if (!activityGroups.has(key)) {
            activityGroups.set(key, []);
        }

        activityGroups.get(key).push(row);
    });

    const activities = [...activityGroups.entries()].map(
        ([activityId, activityRows]) => {
            const score = activityRows.length
                ? activityRows.reduce(
                      (sum, row) =>
                          sum + Number(row.accuracy || 0),
                      0
                  ) / activityRows.length
                : 0;

            const stars = activityRows.length
                ? Math.round(
                      activityRows.reduce(
                          (sum, row) =>
                              sum + Number(row.stars || 0),
                          0
                      ) / activityRows.length
                  )
                : 0;

            return {
                activityId,
                score: Math.max(0, Math.min(100, score)),
                stars: Math.max(0, Math.min(3, stars)),
                itemCount: activityRows.length,
            };
        }
    );

    const totalScore = activities.length
        ? activities.reduce(
              (sum, activity) => sum + activity.score,
              0
          ) / activities.length
        : 0;

    const totalStars = activities.reduce(
        (sum, activity) => sum + activity.stars,
        0
    );

    return {
        activities,
        totalScore: Number(
            Math.max(0, Math.min(100, totalScore)).toFixed(2)
        ),
        totalStars,
    };
};

// ==========================================
// Start / Resume Exercise Session
// ==========================================

exports.startSession = async (req, res) => {
    try {
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: "studentId is required.",
            });
        }

        // Reuse one unfinished activity session.
        const existingSession =
            await ExerciseSession.findUnfinishedByStudent(
                Number(studentId)
            );

        if (existingSession) {
            return res.status(200).json({
                success: true,
                message: "Existing activity session resumed.",
                data: {
                    session: existingSession,
                    resumed: true,
                },
            });
        }

        const session =
            await ExerciseSession.create({
                studentId: Number(studentId),
                totalScore: 0,
                totalStars: 0,
                completed: false,
            });

        return res.status(201).json({
            success: true,
            message: "New activity session started.",
            data: {
                session,
                resumed: false,
            },
        });
    } catch (error) {
        console.error("Start Exercise Session Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// Save Exercise Attempt
// ==========================================

exports.saveAttempt = async (req, res) => {
    try {
        const {
            sessionId,
            exerciseId,
            accuracy,
            completionTime,
            stars,
            attempts,
            handwritingImage,
            strokeData,
            strokeCount,
            penLifts,
        } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "sessionId is required.",
            });
        }

        const session =
            await ExerciseSession.findById(
                Number(sessionId)
            );

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Exercise session not found.",
            });
        }

        // Prevent attempts from being added after completion.
        if (Boolean(session.completed)) {
            return res.status(409).json({
                success: false,
                message: "Exercise session is already completed.",
            });
        }

        const attemptId =
            await ExerciseAttempt.create({
                sessionId: Number(sessionId),
                exerciseId:
                    exerciseId !== null &&
                    exerciseId !== undefined &&
                    exerciseId !== ""
                        ? Number(exerciseId)
                        : null,
                accuracy: Number(accuracy) || 0,
                completionTime:
                    Number(completionTime) || 0,
                stars: Number(stars) || 0,
                attempts: Number(attempts) || 1,
                handwritingImage:
                    handwritingImage || null,
                strokeData:
                    typeof strokeData === "string"
                        ? strokeData
                        : JSON.stringify(
                              strokeData || {}
                          ),
                strokeCount:
                    Number(strokeCount) || 0,
                penLifts:
                    Number(penLifts) || 0,
            });

        // Recalculate using activity-level averages.
        const rows =
            await ExerciseAttempt.findBySession(
                Number(sessionId)
            );

        const summary =
            calculateSessionSummary(rows);

        await ExerciseSession.updateScore({
            sessionId: Number(sessionId),
            totalScore: summary.totalScore,
            totalStars: summary.totalStars,
        });

        const attempt =
            await ExerciseAttempt.findById(
                attemptId
            );

        return res.status(201).json({
            success: true,
            message:
                "Exercise attempt saved successfully.",
            data: {
                attempt,
                sessionScore:
                    summary.totalScore,
                totalStars:
                    summary.totalStars,
                activityScores:
                    summary.activities,
            },
        });
    } catch (error) {
        console.error(
            "Save Exercise Attempt Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// Complete Exercise Session
// ==========================================

exports.completeSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const attempts =
            await ExerciseAttempt.findBySession(
                Number(sessionId)
            );

        if (!attempts.length) {
            return res.status(400).json({
                success: false,
                message:
                    "No exercise attempts have been recorded.",
            });
        }

        const summary =
            calculateSessionSummary(attempts);

        await ExerciseSession.complete({
            sessionId: Number(sessionId),
            totalScore: summary.totalScore,
            totalStars: summary.totalStars,
        });

        const session =
            await ExerciseSession.findById(
                Number(sessionId)
            );

        return res.json({
            success: true,
            message:
                "Exercise session completed successfully.",
            data: {
                session,
                attempts,
                activityScores:
                    summary.activities,
            },
        });
    } catch (error) {
        console.error(
            "Complete Exercise Session Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// Get Single Exercise Session
// ==========================================

exports.getSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session =
            await ExerciseSession.findById(
                Number(sessionId)
            );

        if (!session) {
            return res.status(404).json({
                success: false,
                message:
                    "Exercise session not found.",
            });
        }

        const attempts =
            (
                await ExerciseAttempt.findBySession(
                    Number(sessionId)
                )
            ).map((row) => ({
                ...row,
                activity:
                    parseStrokeData(
                        row.stroke_data
                    ),
            }));

        return res.json({
            success: true,
            data: {
                session,
                attempts,
            },
        });
    } catch (error) {
        console.error(
            "Get Exercise Session Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// Get Exercise History for Student
// ==========================================

exports.getStudentHistory = async (req, res) => {
    try {
        const { studentId } = req.params;

        const sessions =
            await ExerciseSession.findByStudent(
                Number(studentId)
            );

        const attempts =
            (
                await ExerciseAttempt.findByStudent(
                    Number(studentId)
                )
            ).map((row) => ({
                ...row,
                activity:
                    parseStrokeData(
                        row.stroke_data
                    ),
            }));

        return res.json({
            success: true,
            data: {
                sessions,
                attempts,
            },
        });
    } catch (error) {
        console.error(
            "Get Student Exercise History Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
