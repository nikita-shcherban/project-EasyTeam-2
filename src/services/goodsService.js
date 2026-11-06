import { Good } from '../models/good.js';

export const getGoodById = async (id) => {
  return await Good.findById(id).populate('category');
};
