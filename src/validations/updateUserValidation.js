import { Segments } from 'celebrate';
import Joi from 'joi';
import { PHONE_VALIDATION_EXPRESSION } from '../constants/formats.js';

export const updateUserValidationSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().trim().min(2).max(32),
    name: Joi.string().trim().min(2).max(32),
    surname: Joi.string().trim().min(2).max(32),
    email: Joi.string().trim().lowercase().email(),
    phone: Joi.string().pattern(PHONE_VALIDATION_EXPRESSION).messages({
      'string.pattern.base': 'Invalid phone number format',
    }),
    city: Joi.string().trim().min(2).max(50),
    novaPoshtaBranch: Joi.string().trim().max(50),
  })
    .min(1)
    .required(),
};
