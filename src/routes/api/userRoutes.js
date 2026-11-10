import { Router } from 'express';
import { getCurrentUserController } from '../../controllers/user/getCurrentUserController.js';
import { updateUserController } from '../../controllers/user/updateUserController.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { celebrate } from 'celebrate';
import { updateUserValidationSchema } from '../../validations/updateUserValidation.js';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get the current user
 *     description: Returns the authenticated user without their password. Requires accessToken and sessionId cookies.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: cookie
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Current user retrieved successfully.
 *       401:
 *         description: Missing credentials, expired access token, or session or user not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/api/users', authenticate, getCurrentUserController);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update user data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/api/users/me',
  authenticate,
  celebrate(updateUserValidationSchema),
  updateUserController,
);

export default router;
