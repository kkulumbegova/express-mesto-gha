const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ForbiddenError = require('../errors/forbidden-err');
const UnautorizedError = require('../errors/unautorized-err');
const ConflictError = require('../errors/conflict-err');

const login = (req, res, next) => {
  const {
    email, password,
  } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === 'Неправильные почта или пароль') { throw new UnautorizedError('Введен неверный email или пароль'); }
      next(err);
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
      // eslint-disable-next-line no-shadow
        .then((user) => res.send(user))
        // eslint-disable-next-line consistent-return
        .catch((err) => {
          if (err.code === 11000) {
            throw new ConflictError('Пользователь с таким email уже существует');
          }
          if (err.name === 'ValidationError') {
            throw new ValidationError('Переданы некорректные данные при создании пользователя');
          }
          next(err);
        });
    });
};
const getUserInfo = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new ValidationError('Передан пользователь с некорректным id');
    }
    next(err);
  });

const getUser = (req, res, next) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } res.send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new ValidationError('Передан пользователь с некорректным id');
    }
    next(err);
  });

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.send(users))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      throw new ValidationError('Переданы некорректные данные');
    }
    next(err);
  });

const updateUser = (req, res, next) => User.findByIdAndUpdate(
  req.user._id,
  { name: req.body.name, about: req.body.about },
  {
    new: true,
    runValidators: true,
  },
)
  .then((user) => {
    if (user._id.toString() === (req.user._id)) {
      res.send(user);
    } else {
      throw new ForbiddenError('Невозможно изменять данные других пользователей');
    }
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      throw new ValidationError('Переданы некорректные данные при обновлении профиля');
    } else if (err.name === 'CastError') {
      throw new ValidationError('Пользователь не найден');
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
      throw new ValidationError('Переданы некорректные данные при обновлении аватара');
    } else if (err.name === 'CastError') {
      throw new ValidationError('Передан некорректный id');
    } else {
      next(err);
    }
  });

module.exports = {
  getUserInfo, createUser, getUser, getUsers, updateUser, updateAvatar, login,
};
