export const getCurrentUserController = (req, res) => {
  res.status(200).json(req.user);
};
