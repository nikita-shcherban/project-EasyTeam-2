import { Segments, Joi } from 'celebrate';
import { PHONE_VALIDATION_EXPRESSION } from '../constants/index.js';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string().required(),
    phone: Joi.string().pattern(PHONE_VALIDATION_EXPRESSION).required(),
    password: Joi.string().min(8).required(),
  }),
};
