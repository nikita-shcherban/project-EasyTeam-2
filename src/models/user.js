import { Schema, model } from 'mongoose';
import { PHONE_VALIDATION_EXPRESSION } from '../constants/formats.js';

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

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      default: undefined,
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

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
