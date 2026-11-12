import createHttpError from 'http-errors';

export const checkAdmin = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(createHttpError(401, 'Користувач не автентифікований'));
  }

  if (user.role !== 'Administrator') {
    return next(
      createHttpError(403, 'Доступ заборонено. Потрібні права адміністратора'),
    );
  }

  next();
};
