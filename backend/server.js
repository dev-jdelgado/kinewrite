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
app.use(cors());
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
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});