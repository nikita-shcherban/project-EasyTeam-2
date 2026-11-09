import { Good } from '../../models/good.js';
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
      filter.size = size;
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
    // Sorting
    const sortOption = {};
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortOrder = sort.startsWith('-') ? -1 : 1;

    if (sortField === 'price') {
      sortOption['price.value'] = sortOrder;
    } else {
      sortOption[sortField] = sortOrder;
    }
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

    const totalPages = Math.ceil(totalCount / limitNumber);

    res.json({
      success: true,
      data: goods,
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
