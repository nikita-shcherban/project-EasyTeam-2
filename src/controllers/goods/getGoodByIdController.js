import { Good } from '../../models/good.js';
import createHttpError from 'http-errors';

export const getGoodByIdController = async (req, res) => {
  const { goodId } = req.params;

  const good = await Good.findById(goodId).populate('category', 'name');

  if (!good) {
    throw createHttpError(404, 'Good not found');
  }

  res.status(200).json({
    success: true,
    data: good,
  });
};
