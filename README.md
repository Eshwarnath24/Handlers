🚀 TrueMetric (Handlers)

TrueMetric is an AI-driven interview evaluation and skill-gap bridging platform designed to help users identify weaknesses and systematically improve them for real technical interviews.

This repository is a monorepo containing:

Frontend (Bun-powered)

Backend (Bun-powered APIs)

Docker-based deployment setup

🎯 Problem Statement

Most interview platforms:

❌ Only test users

❌ Don’t explain weaknesses

❌ Use static questions

❌ Encourage AI copy-paste learning

TrueMetric focuses on improvement, not just evaluation.

🧠 Interview Mode – Skill Gap Bridging (Core Feature)
What Interview Mode Does

Interview Mode simulates real technical interviews and adapts dynamically based on user responses.

It evaluates:

Concept clarity

Depth of understanding

Partial knowledge

Consistency over time

🔁 Skill Gap Bridging Workflow

Interview Simulation

Concept-based, progressive questions

Time-aware evaluation

Gap Detection

Identifies weak concepts

Detects incomplete understanding

Tracks performance patterns

Targeted Reinforcement

Focused follow-up questions

Repeated testing on weak areas

Adaptive difficulty tuning

Re-Evaluation Loop

Measures improvement

Gradually closes skill gaps

✨ Key Features

🧠 Interview Mode with adaptive difficulty

📉 Automatic skill-gap detection

📈 Skill improvement tracking

🔐 JWT-based authentication

⚡ Fast Bun-powered backend

🌐 API-first architecture

🐳 Docker support

🚫 Reduced AI-assisted cheating

🏗️ Tech Stack
Frontend

Bun

React

TypeScript

Tailwind CSS

Backend

Bun

Express.js

TypeScript

PostgreSQL

bcrypt + JWT

dotenv

DevOps

Docker

Docker Compose

Vercel (Frontend)

Render / similar (Backend & DB)

📁 Repository Structure
Handlers/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── index.ts
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Global app state
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities & helpers
│   │   └── pages/        # App pages
│   │
│   ├── public/
│   ├── Dockerfile
│   └── README.md
│
├── .env.local
├── .env.docker
├── docker-compose.yml
├── LICENSE
├── SECURITY.md
└── README.md

⚙️ Environment Variables
Backend (.env.local / .env.docker)
PORT=5000
DATABASE_URL=postgresql://username:password@host:port/dbname
JWT_SECRET=your_secret_key

▶️ Running Locally (Without Docker)
Backend
cd backend
bun install
bun run index.ts

Frontend
cd frontend
bun install
bun run dev

🐳 Running with Docker
docker-compose up --build


This starts:

Frontend

Backend

Database (if configured)

🌐 Live Deployment

Frontend (Vercel):
👉 https://handlers-three.vercel.app

🧪 Project Status

✅ Authentication implemented

✅ Database connected

✅ Profile & basic interview flow

🚧 Skill gap analysis logic

🚧 Adaptive interview engine

🚧 AI-powered feedback system

👥 Contributors

This is a collaborative team project.

Gajula Eshwarnath – Backend, system design

Shanmukha Gautam Pidaparthi – Core development

Kurapati Venkata Lakshmi Narasimha Kushal - Backend, testing, integration

Full contributors list:
👉 https://github.com/Eshwarnath24/Handlers/graphs/contributors

🤝 Contributing

Create a new branch

Commit with clear messages

Open a pull request

📄 License

This project is licensed under the MIT License.
