import { Pool } from "pg";
 // <--- Auto-loads .env variables (requires 'npm i dotenv')

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD, // No default password for safety
  database: process.env.DB_NAME || "my_hackathon_db",
  
  // HACKATHON SAVER: Uncomment this block if you deploy to Render/Railway/Heroku
  // ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export default pool;