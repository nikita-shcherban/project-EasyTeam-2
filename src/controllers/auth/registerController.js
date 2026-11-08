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

  const newUser = await User.create({
    username,
    phone,
    password: hashedPassword,
  });

  const newSession = await createSession(newUser._id);
  setSessionCookies(res, newSession);

  res.status(201).json(newUser);
};
