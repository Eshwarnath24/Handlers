import type { Request, Response } from "express";
import { generateQuiz } from "../services/quizService";

export async function generateQuizController(req: Request, res: Response) {
  try {
    const { role, level, languages } = req.body;

    if (!role || !level || !languages) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const quiz = await generateQuiz({ role, level, languages });

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
}
