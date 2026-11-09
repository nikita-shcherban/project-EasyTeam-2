import createHttpError from 'http-errors';
import { Subscription } from '../models/subscription.js';

export const createSubscription = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      throw createHttpError(409, 'Subscription with this email already exists');
    }

    const subscription = await Subscription.create({ email });

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(
        createHttpError(409, 'Subscription with this email already exists'),
      );
    }
    next(error);
  }
};
