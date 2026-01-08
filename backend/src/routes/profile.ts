import { Router, type Response } from "express"; // ✅ Kept 'type'
import bcrypt from "bcrypt";
import { authenticateToken, type AuthRequest } from "../middleware/auth"; // ✅ Kept 'type'
import {pool} from "../db"; // ✅ ADDED { } (Crucial for runtime)

const router = Router();

// UPDATE NAME
router.put("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  const { name } = req.body;
  const userId = req.user?.userId;

  if (!name) return res.status(400).json({ message: "Name required" });

  try {
    await pool.query("UPDATE users SET name = $1 WHERE id = $2", [name, userId]);
    res.json({ message: "Profile updated" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// CHANGE PASSWORD
router.put("/password", authenticateToken, async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.userId;

  if (!currentPassword || !newPassword) return res.status(400).json({ message: "Missing fields" });

  try {
    const result = await pool.query("SELECT password_hash FROM users WHERE id = $1", [userId]);
    
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
    
    const user = result.rows[0];

    const match = await bcrypt.compare(currentPassword, user.password_hash);

    if (!match) return res.status(401).json({ message: "Incorrect password" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hashed, userId]);

    res.json({ message: "Password updated" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET PROFILE
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, email, name FROM users WHERE id = $1",
      [req.user?.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;