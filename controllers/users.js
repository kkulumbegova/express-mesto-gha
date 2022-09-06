const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');
const NotFound = require('../errors/not-found-err');
const UnautorizedError = require('../errors/unautorized-err');
const ValidationError = require('../errors/validation-err');

const login = (req, res, next) => {
  const {
    email, password,
  } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new UnautorizedError('Неверный пользователь или пароль'));
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
      // eslint-disable-next-line no-shadow, max-len
        .then((user) => res.send({
          name: user.name, about: user.about, avatar: user.avatar, email: user.email,
        }))
        // eslint-disable-next-line consistent-return
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
          } else if (err.name === 'ValidationError') {
            next(new ValidationError('Переданы некорректные данные'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw next(new NotFound('Пользователь не найден'));
    }
    res.send(user);
  })
  .catch(next);

const getUser = (req, res, next) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      throw next(new NotFound('Пользователь не найден'));
    } res.send(user);
  })
  .catch(next);

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.send(users))
  .catch(next);

const updateUser = (req, res, next) => User.findByIdAndUpdate(
  req.user._id,
  { name: req.body.name, about: req.body.about },
  {
    new: true,
    runValidators: true,
  },
)
  .then((user) => res.send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      throw next(new ValidationError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });

const updateAvatar = (req, res, next) => User.findByIdAndUpdate(
  req.user._id,
  { avatar: req.body.avatar },
  {
    new: true,
    runValidators: true,
  },
)
  .then((user) => res.send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      throw next(new ValidationError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });

module.exports = {
  getUserInfo, createUser, getUser, getUsers, updateUser, updateAvatar, login,
};
