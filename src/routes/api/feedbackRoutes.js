import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createFeedback } from '../../controllers/feedback/createFeedbackController.js';
import { createFeedbackValidation } from '../../validations/feedbackValidation.js';
import { authenticate } from '../../middlewares/authenticate.js';

const router = Router();

router.post(
  '/api/:goodId/feedbacks',
  authenticate,
  celebrate(createFeedbackValidation),
  createFeedback,
);

export default router;
