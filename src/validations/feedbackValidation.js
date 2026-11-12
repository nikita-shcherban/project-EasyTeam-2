import { Joi, Segments } from 'celebrate';

export const createFeedbackValidation = {
  [Segments.PARAMS]: Joi.object({
    goodId: Joi.string().hex().length(24).required(),
  }),
  [Segments.BODY]: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    text: Joi.string().trim().min(5).max(500),
    authorName: Joi.string().trim().min(2).max(32),
  }).required(),
};

export const getFeedbacksValidation = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    goodId: Joi.string().hex().length(24),
    category: Joi.string().hex().length(24),
    sort: Joi.string()
      .valid('rating', '-rating', 'createdAt', '-createdAt')
      .default('-createdAt'),
  }),
};
