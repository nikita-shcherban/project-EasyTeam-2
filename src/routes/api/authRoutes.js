import { celebrate } from 'celebrate';
import { Router } from 'express';
import { registerUser } from '../../controllers/auth/registerController.js';
import { registerUserSchema } from '../../validations/registerValidation.js';

const router = Router();

router.post('/api/auth/register', celebrate(registerUserSchema), registerUser);

export default router;
