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

// =========================
// Load Environment Variables
// =========================
dotenv.config();

// =========================
// ES Module Fix
// =========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// Express App
// =========================
const app = express();

// =========================
// Connect Database
// =========================
try {
  await connectDB();
  console.log("✅ MongoDB Connected");
} catch (error) {
  console.error("❌ MongoDB Connection Failed:", error.message);
  process.exit(1);
}

// =========================
// CORS Configuration
// =========================
const allowedOrigins = [
  "http://localhost:5173",
  "https://jobnestfrontendbytejas.vercel.app",
];

// Add CLIENT_URL from .env if available
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, mobile apps, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =========================
// Middleware
// =========================
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// =========================
// Static Files
// =========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =========================
// Root Route
// =========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Job Board Backend API Running",
    version: "1.0.0",
  });
});

// =========================
// Health Check
// =========================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
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
// 404 Handler
// =========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found.`,
  });
});

// =========================
// Global Error Handler
// =========================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}


export default app;