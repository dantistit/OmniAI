import { Router } from 'express';

export const subscribeRouter = Router();

subscribeRouter.get('/', (_, res) => {
  res.json({ message: 'Subscription endpoint coming soon' });
});