import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getAllCategories } from '../../controllers/categoryController.js';
import { getAllCategoriesSchema } from '../../validations/categoryValidation.js';

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Returns a paginated list of categories.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number.
 *         example: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 6
 *         description: Number of categories per page.
 *         example: 6
 *     responses:
 *       200:
 *         description: Categories successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - page
 *                 - perPage
 *                 - totalCategories
 *                 - totalPages
 *                 - categories
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 perPage:
 *                   type: integer
 *                   example: 6
 *                 totalCategories:
 *                   type: integer
 *                   example: 18
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error.
 */
router.get(
  '/api/categories',
  celebrate(getAllCategoriesSchema),
  getAllCategories,
);

export default router;
