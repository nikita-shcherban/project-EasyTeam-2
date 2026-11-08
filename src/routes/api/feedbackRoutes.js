import { Router } from 'express';
import { createFeedback } from '../../controllers/feedback/createFeedbackController.js';
import { createFeedbackValidation } from '../../validations/feedbackValidation.js';

const router = Router();

router.post('/api/feedbacks', createFeedbackValidation, createFeedback);

export default router;
