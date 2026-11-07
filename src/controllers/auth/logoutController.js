import { User } from '../../models/user.js';

export const logoutController = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: null });

  if (res.clearCookie) {
    res.clearCookie('accessToken');
    res.clearCookie('token');
  }

  res.status(204).send();
};
