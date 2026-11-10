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

// округление до 2 знаков после запятой, чтобы не было проблем с точностью при работе с гуалой
const roundMoney = (value) => Math.round(value * 100) / 100;

const orderItemSchema = new Schema(
  {
    goodId: {
      type: Schema.Types.ObjectId,
      ref: 'Good', // тут крч надо чтоб оно совпадало с моделью товара, чтобы можно было делать populate
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

const orderSchema = new Schema(
  {
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
      default: 0, // по тз крч 0 надо, хз чего
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

    // без акка чудак может замутить заказ, поэтому юзер айдишник не обязателен, но если есть - то будет ссылаться на юзера
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

// мои заказики от новых к старым
orderSchema.index({ userId: 1, createdAt: -1 });

// тут крч эта штука будет сама пересчитывать totalPrice при валидации
orderSchema.pre('validate', function () {
  if (Array.isArray(this.items) && this.items.length > 0) {
    const itemsTotal = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    this.totalPrice = roundMoney(itemsTotal + (this.deliveryPrice ?? 0));
  }
});

export const Order = model('Order', orderSchema);
