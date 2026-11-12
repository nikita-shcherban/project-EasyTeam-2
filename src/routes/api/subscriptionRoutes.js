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
 *     description: Публічний ендпоінт для підписки на розсилку новин за email.
 *     tags:
 *       - Subscriptions
 *     requestBody:
 *       required: true
 *       description: Дані для оформлення підписки.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubscriptionRequest'
 *     responses:
 *       201:
 *         description: Підписку успішно оформлено.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscriptionResponse'
 *       400:
 *         description: Помилка валідації (некоректний або відсутній email).
 *       409:
 *         description: Ця електронна пошта вже підписана на розсилку.
 *       500:
 *         description: Внутрішня помилка сервера.
 */
router.post(
  '/api/subscriptions',
  celebrate(createSubscriptionSchema),
  createSubscription,
);

export default router;
