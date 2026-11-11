import createHttpError from 'http-errors';
import { User } from '../../models/user.js';

export const updateUserController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (req.body.name !== undefined) {
      req.body.username = req.body.name;
    }

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
      const field = Object.keys(error.keyPattern ?? {})[0];

      return next(
        createHttpError(409, `${field || 'Field'} is already in use`),
      );
    }
    next(error);
  }
};
