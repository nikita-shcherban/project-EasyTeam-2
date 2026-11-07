import { Router } from 'express';
import authRouter from './api/authRoutes.js';

const rootRouter = Router();

rootRouter.use('/api/auth', authRouter);

export default rootRouter;
