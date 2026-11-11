import createHttpError from 'http-errors';
import { Order, ORDER_STATUSES } from '../../models/order.js';

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !ORDER_STATUSES.includes(status)) {
      throw createHttpError(400, `Неправильний статус`);
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!updatedOrder) {
      throw createHttpError(404, 'Ордер не знайдено');
    }

    res.status(200).json({
      success: true,
      message: 'Ордер статус успішно змінено',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
