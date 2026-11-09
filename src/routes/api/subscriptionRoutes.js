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
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: Підписку успішно створено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Subscription created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 663e26f58f1a2b001c9d8e7f
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Помилка валідації (некоректний email або пусте поле)
 *       409:
 *         description: Email вже підписаний на розсилку
 *       500:
 *         description: Внутрішня помилка сервера
 */
router.post(
  '/api/subscriptions',
  celebrate(createSubscriptionSchema),
  createSubscription,
);

export default router;
