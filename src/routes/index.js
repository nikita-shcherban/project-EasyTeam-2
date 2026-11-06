import { Router } from 'express';
import goodsRouter from './api/goodsRoutes.js';

const rootRouter = Router();

rootRouter.use('/api/goods', goodsRouter);

export default rootRouter;
