const jwt = require('jsonwebtoken');
const UnautorizedError = require('../errors/unautorized-err');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnautorizedError('Необходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return next(new UnautorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
