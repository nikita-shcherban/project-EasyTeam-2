import { Router } from 'express';
import { getFeedbacks } from '../../controllers/feedback/getFeedbacksController.js';

const router = Router();

/**
 * @swagger
 * /api/feedbacks:
 *   get:
 *     summary: Отримання списку відгуків
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер сторінки
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Кількість відгуків на сторінці
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: ID товару для фільтрації відгуків
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Категорія для фільтрації
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Сортування (наприклад, -createdAt, rate, -rate)
 *     responses:
 *       200:
 *         description: Успішна відповідь
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       author:
 *                         type: string
 *                       date:
 *                         type: string
 *                       description:
 *                         type: string
 *                       rate:
 *                         type: number
 *                       category:
 *                         type: string
 *                       productId:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalCount:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *       500:
 *         description: Failed to fetch feedbacks
 */
router.get('/api/feedbacks', getFeedbacks);

export default router;
