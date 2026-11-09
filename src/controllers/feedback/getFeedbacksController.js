import { Feedback } from '../../models/feedback.js';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { Good } from '../../models/good.js';

export const getFeedbacks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      goodId,
      category,
      sort = '-createdAt',
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {};

    if (goodId) {
      if (!mongoose.Types.ObjectId.isValid(goodId)) {
        throw createHttpError(400, 'Invalid goodId');
      }

      filter.good = new mongoose.Types.ObjectId(goodId);
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        throw createHttpError(400, 'Invalid category');
      }

      filter['goodData.category'] = new mongoose.Types.ObjectId(category);
    }

    const allowedSortFields = ['createdAt', 'rating'];

    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;

    if (!allowedSortFields.includes(sortField)) {
      throw createHttpError(400, 'Invalid sort field');
    }

    const sortOrder = sort.startsWith('-') ? -1 : 1;

    const sortOption = {
      [sortField]: sortOrder,
    };

    const [result] = await Feedback.aggregate([
      {
        $lookup: {
          from: Good.collection.name,
          localField: 'good',
          foreignField: '_id',
          as: 'goodData',
        },
      },
      {
        $unwind: '$goodData',
      },
      {
        $match: filter,
      },
      {
        $unset: 'goodData',
      },
      {
        $sort: sortOption,
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limitNumber }],
          pagination: [{ $count: 'totalCount' }],
        },
      },
    ]);

    const feedbacks = result?.data || [];
    const totalCount = result?.pagination[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limitNumber);

    res.status(200).json({
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
    if (error.status) {
      throw error;
    }

    throw createHttpError(500, 'Failed to fetch feedbacks', {
      cause: error,
    });
  }
};
