import createHttpError from 'http-errors';
import { Subscription } from '../models/subscription.js';

export const createSubscription = async (req, res) => {
  const { email } = req.body;

  const existing = await Subscription.findOne({ email });
  if (existing) {
    throw createHttpError(409, 'Ця електронна пошта вже підписана на розсилку');
  }

  try {
    const subscription = await Subscription.create({ email });

    res.status(201).json({
      message: 'Підписку успішно оформлено',
      data: subscription,
    });
  } catch (error) {
    // Паралельний запит міг створити підписку між перевіркою та записом
    if (error?.code === 11000) {
      throw createHttpError(
        409,
        'Ця електронна пошта вже підписана на розсилку',
      );
    }
    throw error;
  }
};
