import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../../models/user.js';
import { createSession, setSessionCookies } from '../../services/auth.js';

export const registerUser = async (req, res) => {
  const { username, phone, password } = req.body;

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    throw createHttpError(409, 'Phone in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      username,
      phone,
      password: hashedPassword,
    });

    const newSession = await createSession(newUser._id);
    setSessionCookies(res, newSession);

    return res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      throw createHttpError(409, 'Phone already in use');
    }

    throw error;
  }
};
