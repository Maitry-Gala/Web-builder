import { prisma, Prisma } from "../lib/prisma";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;

export const signupUser = async (req: Request, res: Response) => {
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
    });

    return res.status(201).json({
      message: "User created sucessfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const signinUser = async (req: Request, res: Response) => {
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

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name && !email && !password) {
    return res.status(400).json({
      message: "No fields provided",
    });
  }

  try {
    const data: Prisma.UserUpdateInput = {};

    if (name) data.name = name;
    if (email) data.email = email;

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: {
        id: req.userId,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      user,
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.decode(token) as { exp: number };

    if (!decoded?.exp) {
      return res.status(400).json({ message: "Invalid token" });
    }

    await prisma.blacklistedToken.create({
      data: {
        token,
        expiresAt: new Date(decoded.exp * 1000),
      },
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    await prisma.user.delete({
      where: { id: userId },
    });

    return res.status(200).json({
      message: "User deleted successfuly",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getUserDetail = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" }); 
    }

    return res.status(200).json({ user }); 
  } catch (e) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};