import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log("🚀 STARTING DB CONNECTION..."); // If you don't see this, the file isn't saved.

const poolConfig = {
  user: "myapp_user",
  host: "localhost",
  database: "my_hackathon_db",
  password: "Kushal123", // ✅ HARDCODED: This cannot be undefined
  port: 5432,
  ssl: false,
};

console.log("🔑 PASSWORD IS:", poolConfig.password);

export const pool = new Pool(poolConfig);