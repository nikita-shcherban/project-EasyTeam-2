import { Segments, Joi } from 'celebrate';
import { ORDER_SIZES, ORDER_STATUSES } from '../models/order.js';
import { isValidObjectId } from 'mongoose';

const PHONE_REGEX = /^\+380\d{9}$/;
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

const requiredString = (label, { min, max } = {}) => {
  let schema = Joi.string().trim();

  if (min) schema = schema.min(min);
  if (max) schema = schema.max(max);

  return schema.required().messages({
    'any.required': `${label} is required`,
    'string.base': `${label} must be a string`,
    'string.empty': `${label} is required`,
    'string.min': `${label} is too short`,
    'string.max': `${label} is too long`,
  });
};

// цену + название тут не принимаем их берет контроллер из БД по goodId
const orderItemSchema = Joi.object({
  goodId: Joi.string().pattern(OBJECT_ID_REGEX).required().messages({
    'any.required': 'goodId is required',
    'string.empty': 'goodId is required',
    'string.pattern.base': 'goodId must be a valid ObjectId',
  }),

  size: Joi.string()
    .valid(...ORDER_SIZES)
    .required()
    .messages({
      'any.required': 'Size is required',
      'string.empty': 'Size is required',
      'any.only': `Size must be one of: ${ORDER_SIZES.join(', ')}`,
    }),

  quantity: Joi.number().integer().min(1).max(100).required().messages({
    'any.required': 'Quantity is required',
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.min': 'Quantity must be at least 1',
    'number.max': 'Quantity is too large',
  }),
});

export const orderValidation = {
  createOrder: {
    [Segments.BODY]: Joi.object({
      firstName: requiredString('First name', { min: 2, max: 50 }),

      lastName: requiredString('Last name', { min: 2, max: 50 }),

      phone: Joi.string().trim().pattern(PHONE_REGEX).required().messages({
        'any.required': 'Phone number is required',
        'string.empty': 'Phone number is required',
        'string.pattern.base':
          'Phone number must be in the format +380XXXXXXXXX',
      }),

      city: requiredString('City', { max: 100 }),

      novaPoshtaBranch: requiredString('Nova Poshta branch', {
        max: 50,
      }),

      comment: Joi.string().trim().max(500).allow('').messages({
        'string.max': 'Comment is too long',
      }),

      items: Joi.array()
        .items(orderItemSchema)
        .min(1)
        .max(50)
        // .unique(...) Крч условный чудак не сможет отправить два одинаковых товара в заказе, чтобы обмануть систему. Если он хочет две штуки, пусть пришлёт quantity: 2, а не две строки.
        .unique((a, b) => a.goodId === b.goodId && a.size === b.size)
        .required()
        .messages({
          'any.required': 'Items are required',
          'array.base': 'Items must be an array',
          'array.min': 'At least one item is required',
          'array.max': 'Too many items in one order',
          'array.unique':
            'Duplicate items: merge them into one with a bigger quantity',
        }),
    }),
  },
};

const validateObjectId = (value, helpers) => {
  if (isValidObjectId(value)) {
    return value;
  }

  return helpers.message('Invalid id format');
};

export const updateOrderStatusSchema = {
  params: Joi.object({
    id: Joi.string().custom(validateObjectId).required().messages({
      'any.required': 'ID замовлення обов`язковий',
    }),
  }),
  body: Joi.object({
    status: Joi.string()
      .valid(...ORDER_STATUSES)
      .required()
      .messages({
        'any.only': `Статус має бути одним із наступних: ${ORDER_STATUSES.join(', ')}`,
        'any.required': 'Поле статусу обов`язкове',
      }),
  }),
};
