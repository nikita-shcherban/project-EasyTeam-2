import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createOrderController } from '../../controllers/orders/createOrderController.js';
import {
  orderValidation,
  updateOrderStatusSchema,
} from '../../validations/orderValidation.js';
import { updateOrderStatus } from '../../controllers/orders/updateOrderStatusController.js';
import { checkAdmin } from '../../middlewares/admin.js';
import { authenticate, optionalAuthenticate } from '../../middlewares/authenticate.js';
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
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User orders retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
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
 *     description: Змінювати статус замовлення можуть лише адміністратори
 *     tags:
 *       - Orders
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: ID замовлення
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - processing
 *                   - shipped
 *                   - delivered
 *                   - cancelled
 *     responses:
 *       200:
 *         description: Статус замовлення успішно змінено
 *       400:
 *         description: Некоректний ID або статус
 *       401:
 *         description: Необхідна авторизація
 *       403:
 *         description: Недостатньо прав
 *       404:
 *         description: Замовлення не знайдено
 */
router.patch(
  '/api/orders/:id/status',
  authenticate,
  checkAdmin,
  celebrate(updateOrderStatusSchema),
  updateOrderStatus,
);

export default router;
