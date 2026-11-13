import { Good } from '../../models/good.js';
import { Feedback } from '../../models/feedback.js';
import '../../models/category.js';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';

export const getAllGoods = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      gender,
      size,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt',
    } = req.query;

    // Pagination
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNumber - 1) * limitNumber;

    // Filtering
    const filter = {};

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }
    if (gender) {
      filter.gender = gender;
    }
    if (size) {
      const sizes = Array.isArray(size) ? size : [size];
      filter.size = { $in: sizes };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter['price.value'] = {};
      if (minPrice !== undefined) filter['price.value'].$gte = Number(minPrice);
      if (maxPrice !== undefined) filter['price.value'].$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { prevDescription: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting (_id как второй ключ делает порядок стабильным между страницами)
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortOrder = sort.startsWith('-') ? -1 : 1;

    const sortOption = {
      [sortField === 'price' ? 'price.value' : sortField]: sortOrder,
      _id: sortOrder,
    };

    // Query
    const [goods, totalCount] = await Promise.all([
      Good.find(filter)
        .populate('category', 'name')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber)
        .select('-feedbacks')
        .lean(),
      Good.countDocuments(filter),
    ]);

    // Рейтинг и количество отзывов для товаров текущей страницы.
    // Поддерживает оба формата отзывов:
    //  - из API:  { good, rating }
    //  - из seed: { productId, rate }
    const ids = goods.map((g) => g._id);
    const stats = await Feedback.aggregate([
      {
        $match: {
          $or: [{ good: { $in: ids } }, { productId: { $in: ids } }],
        },
      },
      {
        $addFields: {
          goodRef: { $ifNull: ['$good', '$productId'] },
          score: { $ifNull: ['$rating', '$rate'] },
        },
      },
      {
        $group: {
          _id: '$goodRef',
          rating: { $avg: '$score' },
          feedbacksCount: { $sum: 1 },
        },
      },
    ]);
    const statsById = new Map(stats.map((s) => [String(s._id), s]));

    const data = goods.map((g) => {
      const s = statsById.get(String(g._id));
      return {
        ...g,
        rating: s ? Math.round(s.rating * 10) / 10 : 0,
        feedbacksCount: s ? s.feedbacksCount : 0,
      };
    });

    const totalPages = Math.ceil(totalCount / limitNumber);

    res.json({
      success: true,
      data,
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
    throw createHttpError(500, 'Failed to fetch goods', { cause: error });
  }
};
