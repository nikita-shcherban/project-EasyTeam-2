import { Session } from '../../models/session.js';

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId, userId: req.user._id });
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
