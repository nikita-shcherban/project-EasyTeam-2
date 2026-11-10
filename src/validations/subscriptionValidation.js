import { Joi, Segments } from 'celebrate';

export const createSubscriptionSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
      'string.base': 'Email має бути рядком',
      'string.empty': 'Email не може бути порожнім',
      'string.email': 'Введіть коректну адресу електронної пошти',
      'any.required': 'Email є обовʼязковим полем',
    }),
  })
    .required()
    .messages({
      'object.unknown': 'Поле {#label} не дозволене',
    }),
};
