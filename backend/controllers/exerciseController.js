const ExerciseSession = require("../models/ExerciseSession");
const ExerciseAttempt = require("../models/ExerciseAttempt");

const pool = require("../config/db");

// Parse stroke data safely
const parseStrokeData = (value) => {
    try {
        return typeof value === "string"
            ? JSON.parse(value)
            : value || {};
    } catch {
        return {};
    }
};


/**
 * Calculate the session score from activity-level averages.
 *
 * Each activity may contain many item attempts. The session score
 * should first average the items belonging to each activity, then
 * average those activity scores. This prevents an activity with
 * more items/retries from dominating the final session score.
 */
const calculateSessionSummary = (rows = []) => {
    const activityGroups = new Map();

    rows.forEach(row => {
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
            const score =
                activityRows.length
                    ? activityRows.reduce(
                          (sum, row) =>
                              sum + Number(row.accuracy || 0),
                          0
                      ) / activityRows.length
                    : 0;

            const stars =
                activityRows.length
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

    const totalScore =
        activities.length
            ? activities.reduce(
                  (sum, activity) => sum + activity.score,
                  0
              ) / activities.length
            : 0;

    const totalStars =
        activities.reduce(
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

        const {
            studentId,
        } = req.body;

        if (!studentId) {

            return res.status(400).json({

                success: false,

                message:
                    "studentId is required.",

            });

        }

        // ==========================================
        // IMPORTANT:
        // Reuse the student's unfinished activity
        // session instead of creating another one.
        // ==========================================

        const [existingRows] =
            await pool.query(
                `
                SELECT
                    session_id,
                    student_id,
                    session_date,
                    total_score,
                    total_stars,
                    completed

                FROM exercise_sessions

                WHERE
                    student_id = ?
                    AND completed = 0

                ORDER BY session_id DESC

                LIMIT 1
                `,
                [
                    studentId,
                ]
            );


        // ==========================================
        // Resume existing activity session
        // ==========================================

        if (
            existingRows.length > 0
        ) {

            return res.status(200).json({

                success: true,

                message:
                    "Existing activity session resumed.",

                data: {

                    session:
                        existingRows[0],

                    resumed:
                        true,

                },

            });

        }


        // ==========================================
        // Create ONE new activity session
        // ==========================================

        const [
            result
        ] =
            await pool.query(
                `
                INSERT INTO exercise_sessions (

                    student_id,
                    total_score,
                    total_stars,
                    completed

                )

                VALUES (?, 0, 0, 0)
                `,
                [
                    studentId,
                ]
            );


        const sessionId =
            result.insertId;


        // ==========================================
        // Load newly created session
        // ==========================================

        const [
            rows
        ] =
            await pool.query(
                `
                SELECT
                    session_id,
                    student_id,
                    session_date,
                    total_score,
                    total_stars,
                    completed

                FROM exercise_sessions

                WHERE session_id = ?
                `,
                [
                    sessionId,
                ]
            );


        return res.status(201).json({

            success: true,

            message:
                "New activity session started.",

            data: {

                session:
                    rows[0],

                resumed:
                    false,

            },

        });

    } catch (error) {

        console.error(
            "Start Exercise Session Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message,

        });

    }

};

// Save an exercise attempt
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

        const session = await ExerciseSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Exercise session not found.",
            });
        }

        const attemptId = await ExerciseAttempt.create({
            sessionId,
            exerciseId: exerciseId || null,
            accuracy: Number(accuracy) || 0,
            completionTime: Number(completionTime) || 0,
            stars: Number(stars) || 0,
            attempts: Number(attempts) || 1,
            handwritingImage: handwritingImage || null,
            strokeData:
                typeof strokeData === "string"
                    ? strokeData
                    : JSON.stringify(strokeData || {}),
            strokeCount: Number(strokeCount) || 0,
            penLifts: Number(penLifts) || 0,
        });

        // Recalculate the session from activity-level averages.
        const rows =
            await ExerciseAttempt.findBySession(sessionId);

        const summary =
            calculateSessionSummary(rows);

        await ExerciseSession.updateScore({
            sessionId,
            totalScore: summary.totalScore,
            totalStars: summary.totalStars,
        });

        const attempt = await ExerciseAttempt.findById(attemptId);

        res.status(201).json({
            success: true,
            message: "Exercise attempt saved successfully.",
            data: {
                attempt,
                sessionScore: summary.totalScore,
                totalStars: summary.totalStars,
                activityScores: summary.activities,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Complete an exercise session
exports.completeSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const attempts = await ExerciseAttempt.findBySession(sessionId);

        if (!attempts.length) {
            return res.status(400).json({
                success: false,
                message: "No exercise attempts have been recorded.",
            });
        }

        // Final session score is based on the average score of
        // each completed activity, not the sum of all item scores.
        const summary =
            calculateSessionSummary(attempts);

        await ExerciseSession.complete({
            sessionId,
            totalScore: summary.totalScore,
            totalStars: summary.totalStars,
        });

        const session =
            await ExerciseSession.findById(sessionId);

        res.json({
            success: true,
            message: "Exercise session completed successfully.",
            data: {
                session,
                attempts,
                activityScores: summary.activities,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get a single exercise session
exports.getSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await ExerciseSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Exercise session not found.",
            });
        }

        const attempts = (
            await ExerciseAttempt.findBySession(sessionId)
        ).map((row) => ({
            ...row,
            activity: parseStrokeData(row.stroke_data),
        }));

        res.json({
            success: true,
            data: {
                session,
                attempts,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get exercise history for a student
exports.getStudentHistory = async (req, res) => {
    try {
        const { studentId } = req.params;

        const sessions = await ExerciseSession.findByStudent(studentId);

        const attempts = (
            await ExerciseAttempt.findByStudent(studentId)
        ).map((row) => ({
            ...row,
            activity: parseStrokeData(row.stroke_data),
        }));

        res.json({
            success: true,
            data: {
                sessions,
                attempts,
            },
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};