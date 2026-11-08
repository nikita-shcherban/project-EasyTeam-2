import { Joi } from 'celebrate';

export const updateUserValidationSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(30),
    surname: Joi.string().min(2).max(30),
    phone: Joi.string().min(6).max(20),
    city: Joi.string().min(2).max(50),
    postOffice: Joi.string().min(1).max(50),
  }),
};