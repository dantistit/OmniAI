import { Router } from 'express';

export const chatRouter = Router();

chatRouter.get('/', (_, res) => {
  res.json({ message: 'Chat endpoint coming soon' });
});