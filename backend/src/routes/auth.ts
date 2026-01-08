import { Router } from "express";
import bcrypt from "bcrypt";
import pool from "../db";
import jwt from "jsonwebtoken";

const router = Router();

/* ---------- SIGN UP ---------- */
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  if (email.length > 255 || password.length > 1024) {
    return res.status(400).json({ error: "Invalid input length" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password too short" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2)",
      [email, hash]
    );

    return res.status(201).json({ message: "Signup successful" });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Signup failed" });
  }
});

/* ---------- SIGN IN ---------- */
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const result = await pool.query(
      "SELECT id, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

      const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return res.json({
    message: "Signin successful",
    userId: user.id, // keep this for backward compatibility
    token
  });

  } catch {
    return res.status(500).json({ error: "Signin failed" });
  }
});

export default router;
