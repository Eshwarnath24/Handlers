import Groq from "groq-sdk";
import type { GenerateQuizInput } from "../types/quiz";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

function extractJSON(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Invalid model response");
  }
  return JSON.parse(text.slice(start, end + 1));
}

export async function generateQuiz(input: GenerateQuizInput) {
  const prompt = `
Generate interview questions.

Role: ${input.role}
Level: ${input.level}
Languages: ${input.languages.join(", ")}

Return ONLY valid JSON in this EXACT format:

{
  "mcq": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correctAnswer": 0
    }
  ],
  "coding": [
    {
      "question": "",
      "difficulty": "hard"
    }
  ]
}

Rules:
- Exactly 20 MCQs
- Exactly 8 coding questions
- correctAnswer MUST be a NUMBER (0–3)
- difficulty MUST ALWAYS be "hard"
- No explanation
- No markdown
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error("Empty response from model");
  }

  return extractJSON(text);
}
