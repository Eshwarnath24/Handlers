import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST, // Render provides this
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // REQUIRED: Enable SSL for Render's production database
  ssl: process.env.DB_HOST && process.env.DB_HOST !== "localhost"
    ? { rejectUnauthorized: false }
    : undefined, 
});

export default pool;