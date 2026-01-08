import { Router } from "express";
import { generateQuizController } from "../controllers/quizController.js";

const router = Router();

router.post("/", generateQuizController);

export default router;
