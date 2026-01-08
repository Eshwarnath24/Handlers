import express from "express";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import cors from "cors";
import dotenv from "dotenv";
import quizRouter from "./routes/quiz";


console.log("🔥 server.ts started");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/health", healthRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);



app.use("/api/quiz", quizRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
