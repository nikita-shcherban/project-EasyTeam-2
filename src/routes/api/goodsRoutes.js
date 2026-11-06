import { Router } from 'express';
import { getGoodByIdController } from '../../controllers/goods/getGoodByIdController.js';
import { getGoodByIdSchema } from '../../validations/goodsValidation.js';

const goodsRouter = Router();

/**
 * @swagger
 * /api/goods/{id}:
 *   get:
 *     summary: Get good details by ID
 *     tags: [Goods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the good
 *     responses:
 *       200:
 *         description: Successfully retrieved good details
 *       400:
 *         description: Invalid good ID format
 *       404:
 *         description: Good not found
 */
goodsRouter.get('/:id', getGoodByIdSchema, getGoodByIdController);

export default goodsRouter;
