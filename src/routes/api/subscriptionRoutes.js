import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createSubscription } from '../../controllers/subscriptionController.js';
import { createSubscriptionSchema } from '../../validations/subscriptionValidation.js';

const router = Router();

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Оформлення підписки на розсилку
 *     description: Публічний ендпоінт для підписки на розсилку новин за email
 *     tags:
 *       - Subscriptions
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Дані для оформлення підписки
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: user@example.com
 *               description: Адреса електронної пошти
 *     responses:
 *       201:
 *         description: Підписку успішно оформлено
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Підписку успішно оформлено
 *             data:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Помилка валідації (некоректний або відсутній email)
 *       409:
 *         description: Ця електронна пошта вже підписана на розсилку
 *       500:
 *         description: Помилка сервера
 */
router.post(
  '/api/subscriptions',
  celebrate(createSubscriptionSchema),
  createSubscription,
);

export default router;
