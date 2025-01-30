import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { redisClient } from '../utils/redis';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

const tokenSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN']),
});

export const generateTokens = (payload: z.infer<typeof tokenSchema>) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError(401, 'Not authorized, no token');
    }

    // Check token blacklist in Redis
    const isBlacklisted = await redisClient.get(`bl_${token}`);
    if (isBlacklisted) {
      throw new AppError(401, 'Token has been revoked');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const validatedToken = tokenSchema.parse(decoded);

    const user = await prisma.user.findUnique({
      where: { id: validatedToken.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new AppError(401, 'User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError(401, 'Token expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authorized');
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError(403, 'Not authorized for this resource');
    }
    next();
  };
};

export const revokeToken = async (token: string) => {
  try {
    const decoded = jwt.decode(token);
    if (decoded && typeof decoded === 'object' && decoded.exp) {
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      await redisClient.setEx(`bl_${token}`, ttl, 'revoked');
    }
  } catch (error) {
    logger.error('Error revoking token:', error);
  }
};