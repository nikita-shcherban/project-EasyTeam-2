import { Feedback } from '../../models/feedback.js';
import { Good } from '../../models/good.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const createFeedback = async (req, res) => {
  const { goodId, author, rating, text } = req.body;

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

  good.feedbacks.push(feedback._id);
  await good.save();

  res.status(201).json({
    success: true,
    data: feedback,
  });
};
