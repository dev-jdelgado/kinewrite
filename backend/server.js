const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const app = express();
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        project: "KineWrite API",
        version: "1.0.0",
        status: "Running",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});