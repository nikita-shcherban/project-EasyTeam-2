import { Joi, Segments } from 'celebrate';
import { PHONE_VALIDATION_EXPRESSION } from '../constants/index.js';

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    phone: Joi.string().pattern(PHONE_VALIDATION_EXPRESSION).required(),
    password: Joi.string().required(),
  }).required(),
};
