import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  let token = null;

  if (authHeader) {
    const [bearer, headerToken] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !headerToken) {
      throw createHttpError(401, 'Auth header should be of type Bearer');
    }
    token = headerToken;
  } else if (req.cookies && (req.cookies.accessToken || req.cookies.token)) {
    token = req.cookies.accessToken || req.cookies.token;
  }

  if (!token) {
    throw createHttpError(401, 'Not authorized');
  }

  let decoded;
  try {
    const secret = process.env.JWT_SECRET || 'jwt-secret-key';
    decoded = jwt.verify(token, secret);
  } catch {
    throw createHttpError(401, 'Not authorized');
  }

  const userId = decoded.id || decoded.userId || decoded._id;
  if (!userId) {
    throw createHttpError(401, 'Not authorized');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw createHttpError(401, 'Not authorized');
  }

  if (user.token && user.token !== token) {
    throw createHttpError(401, 'Not authorized');
  }

  req.user = user;
  next();
};
