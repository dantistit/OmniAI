import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { chatRouter } from './routes/chat';
import { imageRouter } from './routes/image';
import { docsRouter } from './routes/docs';
import { authRouter } from './routes/auth';
import { subscribeRouter } from './routes/subscribe';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? 'https://your-production-domain.com'
      : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-production-domain.com'
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check route
app.get('/health', (_, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/image', imageRouter);
app.use('/api/docs', docsRouter);
app.use('/api/subscribe', subscribeRouter);

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling
app.use(errorHandler);

const port = process.env.PORT || 3000;

httpServer.listen(port, '0.0.0.0', () => {
  logger.info(`Server running at http://localhost:${port}`);
});

export { app, io };