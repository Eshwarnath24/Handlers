import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {pool} from "../db"; // ✅ FIXED: Must use curly braces

const router = Router();

// SIGN UP
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Missing fields" });
  
  if (!process.env.JWT_SECRET) return res.status(500).json({ message: "Server misconfiguration" });

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rowCount && existing.rowCount > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Note: Inserting into 'password_hash'
    const result = await pool.query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email`,
      [email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({ token, user });
  } catch (err) {
    console.error("❌ Signup error:", err);
    return res.status(500).json({ message: "Signup failed" });
  }
});

// SIGN IN
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Missing credentials" });
  
  if (!process.env.JWT_SECRET) return res.status(500).json({ message: "Server misconfiguration" });

  try {
    // Note: Selecting 'password_hash'
    const result = await pool.query("SELECT id, email, password_hash FROM users WHERE email = $1", [email]);

    if (result.rowCount === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err: any) {
    console.error("❌ Signin error:", err);
    return res.status(500).json({ message: "Signin failed", error: err.message });
  }
});

export default router;