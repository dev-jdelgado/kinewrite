const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Database
require("./config/db");

const app = express();

// ==========================================
// Routes
// ==========================================
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");

// ==========================================
// Middleware
// ==========================================
const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server tools and local requests without an Origin header.
        if (!origin) {
            return callback(null, true);
        }

        // During initial deployment, an empty FRONTEND_URL allows all origins.
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("CORS origin not allowed."));
    },
    credentials: true,
}));
app.use(express.json({
    limit: "20mb",
}));

app.use(express.urlencoded({
    extended: true,
    limit: "20mb",
}));

// ==========================================
// API Routes
// ==========================================
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/assessments", assessmentRoutes);

// ==========================================
// API Status
// ==========================================
app.get("/", (req, res) => {
    res.json({
        success: true,
        project: "KineWrite API",
        version: "1.0.0",
        status: "Running",
    });
});

// ==========================================
// Start Server
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 KineWrite API running on port ${PORT}`);
});

// ==========================================
// Upload Photo
// ==========================================
app.use("/uploads", express.static("uploads"));