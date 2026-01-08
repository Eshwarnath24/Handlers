import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "../db"; // ✅ Correct DB Import

// Import routes
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import quizRouter from "./routes/quiz"; // ✅ Added from your upstream update

dotenv.config();

console.log("🔥 server.ts started");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({ origin: "*" })); // Hackathon-friendly (allows all origins)
app.use(express.json());

// Base Route
app.get("/", (_req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Test DB Route (Good for debugging)
app.get("/test-db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Success", time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Mount Routes
app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/api/quiz", quizRouter); // ✅ API prefix is good practice

// Database Connection Check
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err);
  } else {
    console.log("✅ Database Connected at:", res.rows[0].now);
  }
});

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down...");
  await pool.end();
  process.exit(0);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});