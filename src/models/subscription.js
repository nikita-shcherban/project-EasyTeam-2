import { Schema, model } from 'mongoose';

const subscriptionSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Subscription = model('Subscription', subscriptionSchema);
