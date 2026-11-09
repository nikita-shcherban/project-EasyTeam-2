import { Schema } from 'mongoose';
import { model } from 'mongoose';

const goodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    image: String,
    price: {
      value: {
        type: Number,
        required: true,
        min: 0,
        index: true,
      },
      currency: {
        type: String,
        default: 'грн',
      },
    },
    size: [
      {
        type: String,
      },
    ],
    description: String,
    prevDescription: String,
    gender: {
      type: String,
      enum: ['male', 'female', 'unisex'],
      index: true,
    },
    characteristics: [String],
    feedbacks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Feedback',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

goodSchema.index({ name: 'text', description: 'text' });
export const Good = model('Good', goodSchema);
