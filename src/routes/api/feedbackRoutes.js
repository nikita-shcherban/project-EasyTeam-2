import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createFeedback } from '../../controllers/feedback/createFeedbackController.js';
import { getFeedbacks } from '../../controllers/feedback/getFeedbacksController.js';
import {
  createFeedbackValidation,
  getFeedbacksValidation,
} from '../../validations/feedbackValidation.js';
import { optionalAuthenticate } from '../../middlewares/authenticate.js';

const router = Router();

/**
 * @swagger
 * /api/feedbacks:
 *   get:
 *     summary: Get all feedbacks
 *     description: Returns a paginated list of feedbacks with optional filtering by good and category.
 *     tags:
 *       - Feedbacks
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of feedbacks per page
 *         example: 10
 *       - in: query
 *         name: goodId
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Filter feedbacks by good ID
 *         example: 672a1b2c3d4e5f6789012345
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: Filter feedbacks by category ID
 *         example: 672a1b2c3d4e5f6789012348
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - createdAt
 *             - -createdAt
 *             - rating
 *             - -rating
 *           default: -createdAt
 *         description: Sort feedbacks by creation date or rating. Use minus sign for descending order.
 *         example: -createdAt
 *     responses:
 *       200:
 *         description: Feedbacks successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - data
 *                 - pagination
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feedback'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Invalid goodId, category or sort field
 *       500:
 *         description: Internal server error
 */
router.get('/api/feedbacks', celebrate(getFeedbacksValidation), getFeedbacks);

/**
 * @swagger
 * /api/{goodId}/feedbacks:
 *   post:
 *     summary: Create feedback for a good
 *     description: Creates a new feedback for the specified good. Authentication is optional.
 *     tags:
 *       - Feedbacks
 *     parameters:
 *       - in: path
 *         name: goodId
 *         required: true
 *         description: MongoDB ObjectId of the good
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: 672a1b2c3d4e5f6789012345
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFeedbackRequest'
 *     responses:
 *       201:
 *         description: Feedback successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - data
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Invalid goodId or validation error
 *       404:
 *         description: Good not found
 *       500:
 *         description: Internal server error
 */
router.post(
  '/api/:goodId/feedbacks',
  optionalAuthenticate,
  celebrate(createFeedbackValidation),
  createFeedback,
);

export default router;
