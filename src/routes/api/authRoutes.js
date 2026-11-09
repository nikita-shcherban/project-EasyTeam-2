import { celebrate } from 'celebrate';
import { Router } from 'express';
import { registerUser } from '../../controllers/auth/registerController.js';
import { registerUserSchema } from '../../validations/registerValidation.js';
import { logoutController } from '../../controllers/auth/logoutController.js';
import { refreshUserSession } from '../../controllers/auth/refreshUserSession.js';
import { authenticate } from '../../middlewares/authenticate.js';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account, creates an authentication session and sets authentication cookies.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - phone
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: TestUser
 *               phone:
 *                 type: string
 *                 example: "+380991234567"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User successfully registered. Authentication cookies are set.
 *         headers:
 *           Set-Cookie:
 *             description: Sets accessToken, refreshToken and sessionId cookies.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 64f1a2b3c4d5e6f789012345
 *                 username:
 *                   type: string
 *                   example: TestUser
 *                 phone:
 *                   type: string
 *                   example: "+380991234567"
 *                 role:
 *                   type: string
 *                   example: User
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       409:
 *         description: Phone number is already in use.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */

router.post('/api/auth/register', celebrate(registerUserSchema), registerUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the authenticated user, deletes their session and clears authentication cookies.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized - user is not authenticated
 *       500:
 *         description: Internal server error
 */
router.post('/api/auth/logout', authenticate, logoutController);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh user session
 *     description: Validates the current refresh token and session, creates a new session and updates authentication cookies.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Session successfully refreshed. New authentication cookies are set.
 *         headers:
 *           Set-Cookie:
 *             description: Sets new accessToken, refreshToken and sessionId cookies.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session refreshed
 *       401:
 *         description: Session not found or refresh token expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     sessionNotFound:
 *                       value: Session not found
 *                     sessionExpired:
 *                       value: Session token expired
 *       500:
 *         description: Internal server error.
 */
router.post('/api/auth/refresh', refreshUserSession);

export default router;
