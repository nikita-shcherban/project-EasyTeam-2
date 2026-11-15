import 'dotenv/config';
import mongoose from 'mongoose';
import { Order } from '../models/order.js';
import { Counter } from './counter.js';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URL); // имя переменной возьмите свое

  const orders = await Order.find({
    orderNumber: { $not: { $type: 'string' } },
  })
    .sort({ createdAt: 1 }) // от старых к новым
    .select('_id');

  console.log(`Orders without number: ${orders.length}`);

  for (const order of orders) {
    const counter = await Counter.findOneAndUpdate(
      { _id: 'order' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const orderNumber = `ORD-${String(counter.seq).padStart(6, '0')}`;

    await Order.updateOne(
      { _id: order._id },
      { $set: { orderNumber } },
      { timestamps: false }, // не трогаем updatedAt
    );
  }

  console.log('Done');
  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
