import mongoose from 'mongoose';

const goodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Good name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Good description is required'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    salePrice: {
      type: Number,
      default: null,
      min: [0, 'Sale price must be greater than or equal to 0'],
    },
    sizes: {
      type: [String],
      enum: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      default: [],
    },
    gender: {
      type: String,
      enum: ['Жіночий', 'Чоловічий', 'Унісекс'],
      default: 'Унісекс',
    },
    photos: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    details: {
      type: String,
      default: '',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Good = mongoose.model('Good', goodSchema);
