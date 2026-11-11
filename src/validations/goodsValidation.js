import Joi from 'joi';
import { Segments } from 'celebrate';

export const getAllGoodsValidation = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(12),
    category: Joi.string().hex().length(24),
    gender: Joi.string().valid('male', 'female', 'unisex'),
    size: Joi.string().trim(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    search: Joi.string().trim().allow(''),
    sort: Joi.string()
      .valid('price', '-price', 'name', '-name', 'createdAt', '-createdAt')
      .default('-createdAt'),
  }).custom((value, helpers) => {
    if (
      value.minPrice !== undefined &&
      value.maxPrice !== undefined &&
      value.minPrice > value.maxPrice
    ) {
      return helpers.error('any.invalid');
    }
    return value;
  }),
};

export const getGoodByIdValidation = {
  [Segments.PARAMS]: Joi.object({
    goodId: Joi.string().hex().length(24).required(),
  }),
};
