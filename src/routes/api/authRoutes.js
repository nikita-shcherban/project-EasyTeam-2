import { celebrate } from 'celebrate';
import { Router } from 'express';
import { registerUser } from '../../controllers/auth/registerController.js';
import { registerUserSchema } from '../../validations/registerValidation.js';
import { logoutUser } from '../../controllers/auth/logoutController.js';
import {
  loginUser,
  refreshUserSession,
} from '../../controllers/auth/loginController.js';
import { loginUserSchema } from '../../validations/loginValidation.js';

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
 * /api/auth/login:
 *   post:
 *     summary: Log in with a phone number and password
 *     description: Also available at /auth/login.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, password]
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+380991234567"
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Returns the user without their password and sets session cookies.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
router.post(
  ['/auth/login', '/api/auth/login'],
  celebrate(loginUserSchema),
  loginUser,
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Deletes the session and clears cookies without requiring an access token. Also available at /auth/logout.
 *     tags:
 *       - Auth
 *     responses:
 *       204:
 *         description: Successfully logged out
 *       500:
 *         description: Internal server error
 */
router.post(['/auth/logout', '/api/auth/logout'], logoutUser);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh user session
 *     description: Validates the refresh token and session, creates a new session and updates cookies. Also available at /auth/refresh.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: cookie
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
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
router.post(['/auth/refresh', '/api/auth/refresh'], refreshUserSession);

export default router;
