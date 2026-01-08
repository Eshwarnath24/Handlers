import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Export the interface so profile.ts can use it
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  if (!process.env.JWT_SECRET) return res.status(500).json({ message: "No Secret" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    
    // Attach to req.user
    (req as AuthRequest).user = user as { userId: number; email: string };
    next();
  });
};