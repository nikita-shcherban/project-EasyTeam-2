import { Category } from '../models/category.js';

export const getAllCategories = async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const perPage = Math.max(
    1,
    Number.parseInt(req.query.perPage, 10) || 6,
  );

  const skip = (page - 1) * perPage;

  const [categories, totalCategories] = await Promise.all([
    Category.find().skip(skip).limit(perPage),
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
