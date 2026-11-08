import { celebrate, Joi, Segments } from 'celebrate';

export const createFeedbackValidation = celebrate({
  [Segments.BODY]: Joi.object({
    goodId: Joi.string().hex().length(24).required(),
    author: Joi.string().trim().min(2).max(50).required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    text: Joi.string().trim().min(5).max(1000).required(),
  }),
});
