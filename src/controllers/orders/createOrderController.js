import createHttpError from 'http-errors';

import { Good } from '../../models/good.js';
import { Order } from '../../models/order.js';

export const createOrderController = async (req, res) => {
  const { firstName, lastName, phone, city, novaPoshtaBranch, comment, items } =
    req.body;

  const goodIds = [...new Set(items.map((item) => item.goodId.toLowerCase()))];

  const goods = await Good.find({ _id: { $in: goodIds } });

  if (goods.length !== goodIds.length) {
    throw createHttpError(404, 'One or more goods not found');
  }

  const goodsMap = new Map(goods.map((good) => [good._id.toString(), good]));

  const orderItems = items.map(({ goodId, size, quantity }) => {
    const good = goodsMap.get(goodId.toLowerCase());

    if (!good) {
      throw createHttpError(404, 'Good not found');
    }

    if (good.size.length > 0 && !good.size.includes(size)) {
      throw createHttpError(
        400,
        `Size "${size}" is not available for "${good.name}"`,
      );
    }

    return {
      goodId: good._id,
      name: good.name,
      size,
      quantity,
      price: good.price.value,
    };
  });

  const order = await Order.create({
    firstName,
    lastName,
    phone,
    city,
    novaPoshtaBranch,
    comment,
    items: orderItems,
    userId: req.user?._id ?? null,
  });

  res.status(201).json(order);
};
