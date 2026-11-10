import { Router } from 'express';
import { getAllGoods } from '../../controllers/goods/getAllGoodsController.js';
import { celebrate } from 'celebrate';
import { getAllGoodsValidation } from '../../validations/goodsValidation.js';

const router = Router();

/**
 * @swagger
 * /api/goods:
 *   get:
 *     summary: Отримання списку товарів
 *     description: Публічний ендпоінт для отримання списку товарів з фільтрами та пагінацією
 *     tags:
 *       - Goods
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Номер сторінки
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 12
 *         description: Кількість товарів на сторінці
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: 665f12345678901234567890
 *         description: ObjectId категорії
 *
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female, unisex]
 *         description: Стать
 *
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           example: M
 *         description: Розмір (S, M, L, XL тощо)
 *
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Мінімальна ціна
 *
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Максимальна ціна
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Пошук по назві або опису
 *
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, -price, name, -name, createdAt, -createdAt]
 *           default: -createdAt
 *         description: Сортування (для ціни використовуй price / -price)
 *
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
 *                       name:
 *                         type: string
 *                       category:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       image:
 *                         type: string
 *                       price:
 *                         type: object
 *                         properties:
 *                           value:
 *                             type: number
 *                           currency:
 *                             type: string
 *                       size:
 *                         type: array
 *                         items:
 *                           type: string
 *                       gender:
 *                         type: string
 *                         enum: [male, female, unisex]
 *                       description:
 *                         type: string
 *                       prevDescription:
 *                         type: string
 *                       characteristics:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *
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
 *
 *       500:
 *         description: Помилка сервера
 */
router.get('/api/goods', celebrate(getAllGoodsValidation), getAllGoods);

export default router;
