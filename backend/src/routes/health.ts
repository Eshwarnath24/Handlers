import { Router } from "express";
import { pool } from "../../db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT current_database(), current_user, NOW()"
    );

    res.json({
      status: "ok",
      db: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
