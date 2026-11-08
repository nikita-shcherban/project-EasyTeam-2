import { Schema, model } from 'mongoose';
import { PHONE_VALIDATION_EXPRESSION } from '../constants';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: PHONE_VALIDATION_EXPRESSION,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
  { timestamps: true },
);

export const User = model('User', userSchema);
