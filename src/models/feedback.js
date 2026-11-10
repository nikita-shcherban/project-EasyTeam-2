import { Schema, model } from 'mongoose';

const feedbackSchema = new Schema(
  {
    good: {
      type: Schema.Types.ObjectId,
      ref: 'Good',
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Feedback = model('Feedback', feedbackSchema);
