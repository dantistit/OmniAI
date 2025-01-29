import { Router } from 'express';

export const imageRouter = Router();

imageRouter.get('/', (_, res) => {
  res.json({ message: 'Image generation endpoint coming soon' });
});