import { Segments, Joi } from 'celebrate';
import { PHONE_VALIDATION_EXPRESSION } from '../constants/index.js';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().trim().min(2).max(32).required(),
    phone: Joi.string().pattern(PHONE_VALIDATION_EXPRESSION).required(),
    password: Joi.string().min(8).required(),
  }).required(),
};
