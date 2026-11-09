import { Router } from 'express';
import { getAllGoods } from '../../controllers/goods/getAllGoodsController.js';
import { getGoodById } from '../../controllers/goods/getGoodByIdController.js';

const router = Router();

router.get('/api/goods', getAllGoods);
router.get('/api/goods/:goodId', getGoodById);

export default router;
