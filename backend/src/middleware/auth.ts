import { type Request, type Response, type NextFunction } from "express";
const jwtSecret = process.env.JWT_SECRET!;
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

interface JwtPayload {
  userId: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
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
    const isBlacklisted = await prisma.blacklistedToken.findUnique({
      where: { token },
    });

    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token invalidated, please login again",
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select :{
        id : true,
      }
    });

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (e) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};
