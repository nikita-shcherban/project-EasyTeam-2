import { Router } from 'express';
import { updateUserController } from '../../controllers/user/updateUserController.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { celebrate } from 'celebrate';
import { updateUserValidationSchema } from '../../validations/updateUserValidation.js';

const router = Router();

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update user data
 *     description: Updates the authenticated user's profile. Requires accessToken cookie.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       description: User data to update.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or invalid user data.
 *       401:
 *         description: Unauthorized.
 *       409:
 *         description: Email or phone number is already in use.
 *       500:
 *         description: Internal server error.
 */
router.patch(
  '/api/users/me',
  authenticate,
  celebrate(updateUserValidationSchema),
  updateUserController,
);

export default router;
