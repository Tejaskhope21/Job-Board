import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./src/config/database.js";

import authRoutes from "./src/routes/authRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import resumeRoutes from "./src/routes/resumeRoutes.js";
import aiRoutes from "./src/routes/ai.js";

// Load .env
dotenv.config();

// Debug (remove later)
console.log("Mongo URI Loaded:", process.env.MONGODB_URI ? "YES ✅" : "NO ❌");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect MongoDB
await connectDB();

// =========================
// Middleware
// =========================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Static Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =========================
// Root Route
// =========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Job Board Backend API Running",
    version: "1.0.0",
  });
});

// =========================
// Health Route
// =========================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    time: new Date(),
  });
});

// =========================
// API Routes
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);

// =========================
// 404
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// =========================
// Error Handler
// =========================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =========================
// Local Server
// =========================

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server Running on http://localhost:${PORT}`);
  });
}

export default app;