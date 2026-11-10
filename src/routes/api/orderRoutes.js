import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createOrderController } from '../../controllers/orders/createOrderController.js';
import { orderValidation } from '../../validations/orderValidation.js';

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Оформлення замовлення
 *     description: Публічний ендпоінт для оформлення замовлення
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, phone, city, novaPoshtaBranch, items]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Ivan
 *               lastName:
 *                 type: string
 *                 example: Petrenko
 *               phone:
 *                 type: string
 *                 example: "+380991234567"
 *               city:
 *                 type: string
 *                 example: Kyiv
 *               novaPoshtaBranch:
 *                 type: string
 *                 example: "12"
 *               comment:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [goodId, size, quantity]
 *                   properties:
 *                     goodId:
 *                       type: string
 *                       example: 665f12345678901234567890
 *                     size:
 *                       type: string
 *                       example: M
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Замовлення створено
 *       400:
 *         description: Помилка валідації або недоступний розмір
 *       404:
 *         description: Товар не знайдено
 */
router.post(
  '/api/orders',
  celebrate(orderValidation.createOrder),
  createOrderController,
);

export default router;
