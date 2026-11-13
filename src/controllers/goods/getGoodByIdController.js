import { Good } from '../../models/good.js';
import { Feedback } from '../../models/feedback.js';
import createHttpError from 'http-errors';

export const getGoodByIdController = async (req, res) => {
  const { goodId } = req.params;

  const good = await Good.findById(goodId)
    .populate('category', 'name')
    .select('-feedbacks')
    .lean();

  if (!good) {
    throw createHttpError(404, 'Good not found');
  }

  const [stats] = await Feedback.aggregate([
    {
      $match: {
        $or: [{ good: good._id }, { productId: good._id }],
      },
    },
    {
      $group: {
        _id: null,
        rating: { $avg: { $ifNull: ['$rating', '$rate'] } },
        feedbacksCount: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      ...good,
      rating: stats ? Math.round(stats.rating * 10) / 10 : 0,
      feedbacksCount: stats ? stats.feedbacksCount : 0,
    },
  });
};
