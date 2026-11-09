import { Feedback } from '../../models/feedback.js';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';

export const getFeedbacks = async (req, res) => {
  try {
    const { page = 1, limit = 10, productId, category, sort = '-createdAt' } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {};
    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
      filter.productId = productId;
    }
    if (category) {
      filter.category = category;
    }

    const sortOption = {};
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    sortOption[sortField] = sortOrder;

    const [feedbacks, totalCount] = await Promise.all([
      Feedback.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Feedback.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);

    res.json({
      success: true,
      data: feedbacks,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalCount,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    throw createHttpError(500, 'Failed to fetch feedbacks', { cause: error });
  }
};
