import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }


  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  try {
    const decoded = jwt.verify(token, secret as string);

    // 🔐 Narrow the type safely
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded)
    ) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.userId = (decoded as { userId: number }).userId;

    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
