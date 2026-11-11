import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { isObjectIdOrHexString } from 'mongoose';
import { User } from '../../models/user.js';
import { Session } from '../../models/session.js';
import { createSession, setSessionCookies } from '../../services/auth.js';

export const loginUser = async (req, res) => {
  const { phone, password } = req.body;
  const { sessionId } = req.cookies ?? {};

  const user = await User.findOne({ phone }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, 'Invalid credentials');
  }

  if (isObjectIdOrHexString(sessionId)) {
    await Session.deleteOne({
      _id: sessionId,
      userId: user._id,
    });
  }

  const session = await createSession(user._id);
  setSessionCookies(res, session);

  res.status(200).json(user);
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies ?? {};

  if (
    !isObjectIdOrHexString(sessionId) ||
    typeof refreshToken !== 'string' ||
    !refreshToken
  ) {
    throw createHttpError(401, 'Session not found');
  }

  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntil.getTime() <= Date.now()) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = await createSession(session.userId);

  const result = await Session.deleteOne({ _id: session._id, refreshToken });
  if (!result.deletedCount) {
    await Session.deleteOne({ _id: newSession._id });
    throw createHttpError(401, 'Session not found');
  }

  setSessionCookies(res, newSession);

  res.status(200).json({ message: 'Session refreshed' });
};
