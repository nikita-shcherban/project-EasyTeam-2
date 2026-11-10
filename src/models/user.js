import { Schema, model } from 'mongoose';
import { PHONE_VALIDATION_EXPRESSION } from '../constants/formats.js';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },

    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },

    surname: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: PHONE_VALIDATION_EXPRESSION,
    },

    city: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ['User', 'Administrator'],
      default: 'User',
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $type: 'string' },
    },
  },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
