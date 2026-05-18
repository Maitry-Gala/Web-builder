import { prisma } from "../lib/prisma";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;

export const signupUser = async(
req: Request, res: Response) => {
    const { email, password, name } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 3);

      const user = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
          name: name,
        },
      });

      return res.status(200).json({
        message: "User created sucessfully",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Something went wrong!",
      });
    }
  };

export const signinUser = 
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res.status(403).json({
          message: "Invalid email or password",
        });
      }

      const passwordMatched = await bcrypt.compare(password, user.password);

      if (passwordMatched) {
        const token = jwt.sign(
          {
            userId: user.id,
          },
          JWT_SECRET,
          { expiresIn: "1d" },
        );

        return res.status(200).json({
          message: "You are signed in",
          token: token,
        });
      } else {
        return res.status(403).json({
          message: "Invalid email or password",
        });
      }
    } catch (e) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };
