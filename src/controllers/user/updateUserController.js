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
      throw createHttpError(404, 'Користувача не знайдено');
    }

    res.status(200).json({
      status: 200,
      message: 'Дані користувача успішно оновлено',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
