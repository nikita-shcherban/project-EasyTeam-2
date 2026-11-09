import { celebrate } from 'celebrate';
import { Router } from 'express';
import { registerUser } from '../../controllers/auth/registerController.js';
import { registerUserSchema } from '../../validations/registerValidation.js';
import { logoutController } from '../../controllers/auth/logoutController.js';
import { authenticate } from '../../middlewares/authenticate.js';

const router = Router();

router.post('/api/auth/register', celebrate(registerUserSchema), registerUser);

router.post('/api/auth/logout', authenticate, logoutController);

export default router;
