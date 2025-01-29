import { Router } from 'express';

export const docsRouter = Router();

docsRouter.get('/', (_, res) => {
  res.json({ message: 'Documentation endpoint coming soon' });
});