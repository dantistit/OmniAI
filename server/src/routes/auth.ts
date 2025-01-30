import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { generateTokens } from '../middleware/authMiddleware';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new AppError(401, 'Invalid credentials');
    }

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
});