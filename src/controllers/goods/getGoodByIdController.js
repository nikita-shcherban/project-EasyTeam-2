import createHttpError from 'http-errors';
import { getGoodById } from '../../services/goodsService.js';

export const getGoodByIdController = async (req, res) => {
  const { id } = req.params;

  const good = await getGoodById(id);

  if (!good) {
    throw createHttpError(404, 'Good not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found good by id!',
    data: good,
  });
};
