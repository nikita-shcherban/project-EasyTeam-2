import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';
import { isObjectIdOrHexString } from 'mongoose';

export const authenticate = async (req, res, next) => {
  try {
    const { accessToken, sessionId } = req.cookies ?? {};

    if (
      typeof accessToken !== 'string' ||
      !accessToken ||
      !isObjectIdOrHexString(sessionId)
    ) {
      throw createHttpError(401, 'Missing access token');
    }

    const session = await Session.findOne({
      _id: sessionId,
      accessToken,
    });
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    if (session.accessTokenValidUntil.getTime() <= Date.now()) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(session.userId);

    if (!user) {
      throw createHttpError(401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthenticate = async (req, res, next) => {
  const { accessToken, sessionId } = req.cookies ?? {};

  if (typeof accessToken !== 'string' || !accessToken) {
    return next();
  }

  const session = await Session.findOne({
    _id: sessionId,
    accessToken,
  });

  if (!session || session.accessTokenValidUntil.getTime() <= Date.now()) {
    return next();
  }

  const user = await User.findById(session.userId);

  if (!user) {
    return next();
  }

  req.user = user;

  next();
};
