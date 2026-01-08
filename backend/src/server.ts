<<<<<<< Updated upstream
import express from "express";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import cors from "cors";
import dotenv from "dotenv";
import quizRouter from "./routes/quiz";

=======
  
  import express from "express";
  import cors from "cors";
  import { pool } from "../db"; // ✅ Added curly braces
>>>>>>> Stashed changes

  // Import routes
  import healthRouter from "./routes/health";
  import authRouter from "./routes/auth";
  import profileRouter from "./routes/profile";

<<<<<<< Updated upstream
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
=======
  console.log("🔥 server.ts started");
>>>>>>> Stashed changes

  const app = express();
  const PORT = 3000;

  app.use(cors({ origin: "*" }));
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.send("Backend is running 🚀");
  });

  // ✅ Test Route
  app.get("/test-db", async (_req, res) => {
    try {
      const result = await pool.query("SELECT NOW()");
      res.json({ message: "Success", time: result.rows[0].now });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });

  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/profile", profileRouter);

  // DB Check
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error("❌ Database Connection Failed:", err);
    } else {
      console.log("✅ Database Connected at:", res.rows[0].now);
    }
  });
  process.on("SIGINT", async () => {
  console.log("🛑 Shutting down...");
  await pool.end();
  process.exit(0);
});


<<<<<<< Updated upstream


app.use("/api/quiz", quizRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
=======
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
  });
>>>>>>> Stashed changes
