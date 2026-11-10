import createHttpError from 'http-errors';
import { Order } from '../../models/order.js';

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch {
    throw createHttpError(404, 'Щось пішло не так');
  }
};
