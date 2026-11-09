import { Category } from '../models/category.js';

export const getAllCategories = async (req, res) => {
  const { page = 1, perPage = 6 } = req.query;

  const skip = (page - 1) * perPage;

  const categoryQuery = Category.find();

  const [categories, totalCategories] = await Promise.all([
    categoryQuery.skip(skip).limit(perPage),
    Category.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalCategories / perPage);

  res.status(200).json({
    page,
    perPage,
    totalCategories,
    totalPages,
    categories,
  });
};
