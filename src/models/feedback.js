import { Schema, model } from 'mongoose';

const feedbackSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    rate: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    category: {
      type: String,
      default: '',
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Good',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Feedback = model('Feedback', feedbackSchema);
