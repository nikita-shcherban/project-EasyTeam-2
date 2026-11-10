import { Segments } from 'celebrate';
import Joi from 'joi';

export const updateUserValidationSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(32),
    surname: Joi.string().min(2).max(32),
    phone: Joi.string().min(6).max(20),
    city: Joi.string().min(2).max(50),
    postoffice: Joi.string().min(1).max(50),
  }),
};
