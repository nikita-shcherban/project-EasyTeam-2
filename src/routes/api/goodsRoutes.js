import { Router } from 'express';
import { getAllGoods } from '../../controllers/goods/getAllGoodsController.js';

const router = Router();

router.get('/api/goods', getAllGoods);

export default router;
