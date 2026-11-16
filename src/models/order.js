import { Schema, model } from 'mongoose';

export const ORDER_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const PHONE_REGEX = /^\+380\d{9}$/;

const FIRST_ORDER_NUMBER = 1235960;
const ORDER_NUMBER_COUNTER_ID = 'orderNumber';

// Округление стоимости до 2 знаков после запятой
const roundMoney = (value) => Math.round(value * 100) / 100;

// Отдельная схема счётчика заказов
const orderCounterSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

const OrderCounter = model('OrderCounter', orderCounterSchema);

// Безопасная генерация уникального номера заказа
const getNextOrderNumber = async () => {
  try {
    // Проверяем, существует ли счётчик.
    // Если его нет, учитываем последний существующий номер.
    const lastOrder = await Order.findOne({
      orderNumber: { $exists: true },
    })
      .sort({ orderNumber: -1 })
      .select('orderNumber')
      .lean();

    const initialNumber = Math.max(
      FIRST_ORDER_NUMBER - 1,
      lastOrder?.orderNumber ?? FIRST_ORDER_NUMBER - 1,
    );

    await OrderCounter.updateOne(
      { _id: ORDER_NUMBER_COUNTER_ID },
      {
        $setOnInsert: {
          seq: initialNumber,
        },
      },
      { upsert: true },
    );
  } catch (error) {
    // При одновременном первом создании счётчика
    // другой запрос мог создать его раньше.
    if (error.code !== 11000) {
      throw error;
    }
  }

  // Атомарно увеличиваем счётчик.
  const counter = await OrderCounter.findOneAndUpdate(
    { _id: ORDER_NUMBER_COUNTER_ID },
    { $inc: { seq: 1 } },
    { new: true },
  );

  if (!counter) {
    throw new Error('Failed to generate order number');
  }

  return counter.seq;
};

// Схема одного товара в заказе
const orderItemSchema = new Schema(
  {
    goodId: {
      type: Schema.Types.ObjectId,
      ref: 'Good',
      required: [true, 'goodId is required'],
    },

    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },

    size: {
      type: String,
      enum: {
        values: ORDER_SIZES,
        message: '{VALUE} is not a valid size',
      },
      required: [true, 'Size is required'],
    },

    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      max: [100, 'Quantity is too large'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer',
      },
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: false },
);

// Основная схема заказа
const orderSchema = new Schema(
  {
    // Уникальный номер заказа
    orderNumber: {
      type: Number,
      unique: true,
      required: true,
      index: true,
    },

    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name is too short'],
      maxlength: [50, 'First name is too long'],
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name is too short'],
      maxlength: [50, 'Last name is too long'],
    },

    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      match: [PHONE_REGEX, 'Phone must be in format +380XXXXXXXXX'],
    },

    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City name is too long'],
    },

    novaPoshtaBranch: {
      type: String,
      required: [true, 'Nova Poshta branch is required'],
      trim: true,
      maxlength: [50, 'Branch value is too long'],
    },

    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment is too long'],
      default: '',
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'Order must contain at least one item',
      },
    },

    deliveryPrice: {
      type: Number,
      min: 0,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: {
        values: ORDER_STATUSES,
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
      index: true,
    },

    // Заказ может быть оформлен без авторизации
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Индекс для получения заказов пользователя от новых к старым
orderSchema.index({ userId: 1, createdAt: -1 });

// Генерация номера и пересчёт стоимости перед валидацией
orderSchema.pre('validate', async function () {
  // Генерируем номер только для нового заказа
  if (this.isNew && this.orderNumber == null) {
    this.orderNumber = await getNextOrderNumber();
  }

  // Пересчитываем общую стоимость
  if (Array.isArray(this.items) && this.items.length > 0) {
    const itemsTotal = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    this.totalPrice = roundMoney(itemsTotal + (this.deliveryPrice ?? 0));
  }
});

export const Order = model('Order', orderSchema);
