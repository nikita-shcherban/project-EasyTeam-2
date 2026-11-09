import createHttpError from 'http-errors';
import { Good } from '../../models/good.js';

export const getGoodById = async (req, res) => {
  const { goodId } = req.params;
  const good = await Good.findById(goodId);

  if (!good) {
    throw createHttpError(404, 'Good not found');
  }

  res.status(200).json(good);
};
