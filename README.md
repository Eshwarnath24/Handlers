# Handlers


🎯 TrueMetric — AI-Driven Skill Evaluation that Enforces Integrity

TrueMetric is a modern assessment & learning platform designed to measure real understanding, not just completion.
Instead of static question banks or cheating-prone online quizzes, it creates a secure & personalised testing journey.

❓ Problem We Solved

Current hackathon & learning platforms face these issues:

🚫 Students paste AI answers
🚫 Same questions reused → zero understanding
🚫 No way to measure true strengths & weaknesses
🚫 No guardrails to stop malpractice

This leads to:

Skill gaps

Bad hiring outcomes

Poor confidence in learning systems

🟢 TrueMetric fixes that

Generates fresh role-specific questions using AI (Grok)

Mixes MCQs + coding

Detects cheating via tab-switch monitoring

Delays hints to encourage thinking

Blocks practice mode until real test attempted

Builds personalised upskilling suggestions

🛠 Tech Stack
Frontend (React + Bun)
React + Vite
TypeScript
TailwindCSS + shadcn/ui
Bun runtime
Context API state management
Lucide icons

Backend (Bun + Express)
Bun Runtime
ExpressJS API
PostgreSQL + pg driver
JWT Authentication
dotenv

AI
Grok API (custom prompt MCQ generation)
<img width="730" height="722" alt="image" src="https://github.com/user-attachments/assets/a91fd783-75e3-4cc6-bba8-aa0ea7451b6c" />


🔧 Setup — Backend

1️⃣ Install dependencies
cd backend
bun install

2️⃣ Create .env file in /backend
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=quizdb

JWT_SECRET=super-secret-key
GROK_API_KEY=your_key_here

3️⃣ Initialise PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
sudo -u postgres createdb quizdb
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'password';
\q

4️⃣ Run backend
bun run dev

🎨 Setup — Frontend
Install deps
cd frontend
bun install

Run dev
bun run dev


Then open:

http://localhost:5173

🧪 How the System Works

1️⃣ User registers + logs in
2️⃣ Selects a role
3️⃣ Chooses role-filtered tech stack (min-3)
4️⃣ Backend calls Grok AI → generates:

10 MCQs

3 coding questions
5️⃣ 45-minute test begins

Time tracked in UI

Tab-switch → warning

3 violations → auto submit
6️⃣ Auto-evaluates MCQ
7️⃣ Coding marked as answered/unanswered
8️⃣ Generates personalised report:

Strengths

Weakness clusters

Areas to practise
9️⃣ Unlocks practice mode based on weaknesses

🔐 Security
JWT stored only in memory
No face/webcam
No clipboard blockin
Ethical monitoring only (tab events)


📈 Why This Project Works
Solves learning integrity
No preloaded question bank → no leaks
Students learn what they don't know
Recruiters trust analytics more than scores
Works with any role & tech stack
