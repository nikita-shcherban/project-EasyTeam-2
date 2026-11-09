import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { Feedback } from '../../models/feedback.js';
import { Good } from '../../models/good.js';

export const createFeedback = async (req, res) => {
  const { goodId } = req.params;
  const { rating, text } = req.body;
  const author = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(goodId)) {
    throw createHttpError(400, 'Invalid goodId');
  }

  const good = await Good.findById(goodId);

  if (!good) {
    throw createHttpError(404, 'Good not found');
  }

  const feedback = await Feedback.create({
    good: goodId,
    author,
    rating,
    text,
  });

  res.status(201).json({
    success: true,
    data: feedback,
  });
};
