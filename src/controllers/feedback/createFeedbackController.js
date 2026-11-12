import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { Feedback } from '../../models/feedback.js';
import { Good } from '../../models/good.js';

export const createFeedback = async (req, res) => {
  const { goodId } = req.params;
  const { rating, text, authorName } = req.body;
  const author = req.user?._id || null;

  if (!mongoose.Types.ObjectId.isValid(goodId)) {
    throw createHttpError(400, 'Invalid goodId');
  }

  const good = await Good.findById(goodId);

  if (!good) {
    throw createHttpError(404, 'Good not found');
  }

  if (!req.user && !authorName?.trim()) {
    throw createHttpError(400, 'Guest name is required');
  }

  const feedback = await Feedback.create({
    good: goodId,
    author,
    authorName: author ? undefined : `Гість ${authorName}`,
    rating,
    text,
  });

  res.status(201).json({
    success: true,
    data: feedback,
  });
};
