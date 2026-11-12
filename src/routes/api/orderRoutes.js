import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createOrderController } from '../../controllers/orders/createOrderController.js';
import {
  orderValidation,
  updateOrderStatusSchema,
} from '../../validations/orderValidation.js';
import { updateOrderStatus } from '../../controllers/orders/updateOrderStatusController.js';
import { checkAdmin } from '../../middlewares/admin.js';
import {
  authenticate,
  optionalAuthenticate,
} from '../../middlewares/authenticate.js';
import { getUserOrders } from '../../controllers/orders/getUserOrdersController.js';

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
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Замовлення створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Помилка валідації або недоступний розмір
 *       404:
 *         description: Товар не знайдено
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.post(
  '/api/orders',
  optionalAuthenticate,
  celebrate(orderValidation.createOrder),
  createOrderController,
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Отримання замовлень поточного користувача
 *     description: Повертає список замовлень авторизованого користувача
 *     tags:
 *       - Orders
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Замовлення успішно отримано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserOrdersResponse'
 *       401:
 *         description: Необхідна авторизація
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.get('/api/orders', authenticate, getUserOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Зміна статусу замовлення
 *     description: Змінювати статус замовлення можуть лише адміністратори.
 *     tags:
 *       - Orders
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID замовлення
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 665f12345678901234567890
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusRequest'
 *     responses:
 *       200:
 *         description: Статус замовлення успішно змінено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Некоректний ID або статус
 *       401:
 *         description: Необхідна авторизація
 *       403:
 *         description: Недостатньо прав
 *       404:
 *         description: Замовлення не знайдено
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.patch(
  '/api/orders/:id/status',
  authenticate,
  checkAdmin,
  celebrate(updateOrderStatusSchema),
  updateOrderStatus,
);

export default router;
