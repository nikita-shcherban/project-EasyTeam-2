import { Joi, Segments } from 'celebrate';

export const createFeedbackValidation = {
  [Segments.PARAMS]: Joi.object({
    goodId: Joi.string().hex().length(24).required(),
  }),
  [Segments.BODY]: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    text: Joi.string().trim().max(1000),
  }),
};
