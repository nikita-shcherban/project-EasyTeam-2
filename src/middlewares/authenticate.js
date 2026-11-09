import createHTTPError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const { accessToken, sessionId } = req.cookies ?? {};
    if (!accessToken || !sessionId) {
      throw createHTTPError(401, 'Missing access token or session ID');
    }
    const session = await Session.findOne({ _id: sessionId, accessToken });
    if (!session) {
      throw createHTTPError(401, 'Session not found');
    }
    if (session.accessTokenValidUntil < new Date()) {
      throw createHTTPError(401, 'Access token expired');
    }
    const user = await User.findById(session.userId);
    if (!user) {
      throw createHTTPError(401, 'Unauthorized: User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
