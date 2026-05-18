import { type Request, type Response, type NextFunction } from "express";
const jwtSecret = process.env.JWT_SECRET!;
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid token format",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (decoded) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(403).json({
        message: "You are not logged in",
      });
    }
  } catch (e) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};
