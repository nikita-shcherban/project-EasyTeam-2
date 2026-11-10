import createHttpError from 'http-errors';
import { User } from '../../models/user.js';

export const updateUserController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json({
      status: 200,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(
        createHttpError(409, 'Email or phone number is already in use'),
      );
    }

    next(error);
  }
};
