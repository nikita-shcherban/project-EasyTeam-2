import { Schema } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    default: undefined,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },

  timestamps: true,
});

userSchema.pre('save', function () {
  if (!this.username) {
    this.username = this.email;
  }
});
