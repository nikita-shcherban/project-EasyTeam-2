import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { Feedback } from '../../models/feedback.js';
import { Good } from '../../models/good.js';

const getDisplayName = (user) => {
  const fullName = [user.name, user.surname].filter(Boolean).join(' ');
  return fullName || user.username;
};

export const createFeedback = async (req, res) => {
  const { goodId } = req.params;
  const { rating, text, authorName } = req.body;

  if (!mongoose.Types.ObjectId.isValid(goodId)) {
    throw createHttpError(400, 'Invalid goodId');
  }

  const good = await Good.findById(goodId);

  if (!good) {
    throw createHttpError(404, 'Good not found');
  }

  let author = null;
  let finalAuthorName;

  if (req.user) {
    author = req.user._id;
    finalAuthorName = getDisplayName(req.user);
  } else {
    const guestName = authorName
      ?.trim()
      .replace(/^(Гість\s*)+/i, '')
      .trim();
  
    if (!guestName) {
      throw createHttpError(400, 'Guest name is required');
    }
  
    finalAuthorName = `Гість ${guestName}`;
  }

  const feedback = await Feedback.create({
    good: goodId,
    author,
    authorName: finalAuthorName,
    rating,
    text,
  });

  res.status(201).json({
    success: true,
    data: feedback,
  });
};
