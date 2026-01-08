import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

export const pool = new Pool({
  connectionString,
  // 🟢 FIX: Enable SSL for cloud databases (Render/Neon/Supabase)
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false, 
});