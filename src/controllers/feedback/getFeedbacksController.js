import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { Feedback } from '../../models/feedback.js';
import { Good } from '../../models/good.js';

const ALLOWED_SORT_FIELDS = ['createdAt', 'rating'];

export const getFeedbacks = async (req, res) => {
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

  // сортировка
  const sortField = sort.startsWith('-') ? sort.slice(1) : sort;

  if (!ALLOWED_SORT_FIELDS.includes(sortField)) {
    throw createHttpError(400, 'Invalid sort field');
  }

  const sortOrder = sort.startsWith('-') ? -1 : 1;

  // _id в конце нужен для стабильного порядка при одинаковых значениях
  const sortOption = { [sortField]: sortOrder, _id: -1 };

  // пайплайн
  const pipeline = [];

  if (goodId) {
    if (!mongoose.Types.ObjectId.isValid(goodId)) {
      throw createHttpError(400, 'Invalid goodId');
    }

    pipeline.push({
      $match: { good: new mongoose.Types.ObjectId(goodId) },
    });
  }

  // $lookup нужен только для фильтра по категории товара
  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      throw createHttpError(400, 'Invalid category');
    }

    pipeline.push(
      {
        $lookup: {
          from: Good.collection.name,
          localField: 'good',
          foreignField: '_id',
          as: 'goodData',
        },
      },
      { $unwind: '$goodData' },
      {
        $match: {
          'goodData.category': new mongoose.Types.ObjectId(category),
        },
      },
      { $unset: 'goodData' },
    );
  }

  pipeline.push(
    { $sort: sortOption },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limitNumber }],
        pagination: [{ $count: 'totalCount' }],
      },
    },
  );

  const [result] = await Feedback.aggregate(pipeline);

  const feedbacks = result?.data ?? [];
  const totalCount = result?.pagination[0]?.totalCount ?? 0;
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
};
