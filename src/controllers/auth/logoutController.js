import { isObjectIdOrHexString } from 'mongoose';
import { Session } from '../../models/session.js';

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies ?? {};
  if (isObjectIdOrHexString(sessionId)) {
    await Session.deleteOne({ _id: sessionId });
  }

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  res.clearCookie('sessionId', cookieOptions);
  res.status(204).send();
};

export { logoutUser as logoutController };
