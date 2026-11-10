import Joi from 'joi';
import { Segments } from 'celebrate';

export const getAllGoodsValidation = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string()
      .valid('name', 'price.value', 'createdAt')
      .default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    category: Joi.string().hex().length(24),
    gender: Joi.string().valid('male', 'female', 'unisex'),
    search: Joi.string().trim().allow(''),
  }),
};
