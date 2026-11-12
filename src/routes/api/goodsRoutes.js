import { Router } from 'express';
import { getAllGoods } from '../../controllers/goods/getAllGoodsController.js';
import { celebrate } from 'celebrate';
import {
  getAllGoodsValidation,
} from '../../validations/goodsValidation.js';
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
 *           pattern: '^[0-9a-fA-F]{24}$'
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
 *         description: Розмір товару
 *
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Мінімальна ціна
 *
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
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
 *         description: Сортування товарів
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
 *                     $ref: '#/components/schemas/Good'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Некоректні параметри запиту
 *       500:
 *         description: Помилка сервера
 */

router.get('/api/goods', celebrate(getAllGoodsValidation), getAllGoods);


export default router;
