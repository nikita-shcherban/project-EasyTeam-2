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
