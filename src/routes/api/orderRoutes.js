// src/routes/api/orderRoutes.js
import { Router } from 'express';
import { celebrate } from 'celebrate';

import { orderValidation } from '../../validations/order.js';
import { createOrderController } from '../../controllers/orders/createOrderController.js';

const router = Router();

// POST /api/orders: публичный эндпоинт оформления заказа
router.post('/', celebrate(orderValidation.createOrder), createOrderController);

export default router;
