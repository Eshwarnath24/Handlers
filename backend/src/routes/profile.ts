import { Router } from "express";
import { authMiddleware } from "../middleware/auth";

const router = Router();

/**
 * GET /profile
 * Protected route – requires valid JWT
 */
router.get("/", authMiddleware, (req, res) => {
  // ✅ No more 'as any' needed!
  res.json({
    message: "Protected route accessed",
    userId: req.userId, 
  });
});

export default router;