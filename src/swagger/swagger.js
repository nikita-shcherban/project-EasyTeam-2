import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'EasyTeam Clothica API',
      description: 'API endpoints to Clothica Web Service',
      version: '1.0.0',
    },
    tags: [
      {
        name: 'Auth',
        description: 'User authentication endpoints',
      },
      {
        name: 'Users',
        description: 'Operations on the users endpoints',
      },
      {
        name: 'Categories',
        description: 'Operations on the categories',
      },
      {
        name: 'Goods',
        description: 'Operations on the goods',
      },
      {
        name: 'Orders',
        description: 'Operations on the orders',
      },
      {
        name: 'Feedbacks',
        description: 'Operations on the feedbacks',
      },
      {
        name: 'Subscriptions',
        description: 'Operations on the subscriptions',
      },
    ],
  },
  apis: ['src/**/*.js'],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);

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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 12
 *         description: Кількість товарів на сторінці
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: ObjectId категорії
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female, unisex]
 *         description: Стать
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           example: M
 *         description: Розмір (S, M, L, XL тощо)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Мінімальна ціна
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Максимальна ціна
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Пошук по назві або опису
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, -price, name, -name, createdAt, -createdAt]
 *           default: -createdAt
 *         description: Сортування (для ціни використовуй price / -price)
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
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
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
 *                       description:
 *                         type: string
 *                       characteristics:
 *                         type: array
 *                         items:
 *                           type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *       500:
 *         description: Помилка сервера
 */
