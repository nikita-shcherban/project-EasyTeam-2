import { Router } from 'express';
import { logoutController } from '../../controllers/auth/logoutController.js';
import { authenticate } from '../../middlewares/authenticate.js';

const authRouter = Router();

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Successfully logged out
 *       401:
 *         description: Not authorized
 */
authRouter.post('/logout', authenticate, logoutController);

export default authRouter;
