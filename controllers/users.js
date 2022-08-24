const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');

const errorNotFound = 404;
const errorValidation = 400;
const errorServer = 500;

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
    .catch(next);
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
          }
          return next(err);
        });
    });
};
const getUserInfo = (req, res) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      res.status(errorNotFound).send({ message: 'Пользователь не найден' });
    } else {
      res.send({ data: user });
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res
        .status(errorValidation)
        .send({ message: 'Передан пользователь с некорректным id' });
    } else {
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    }
  });

const getUser = (req, res) => User.findById(req.params.userId)
  .then((user) => {
    if (user === null) {
      res.status(errorNotFound).send({ message: 'Пользователь не найден' });
    } else {
      res.send({ data: user });
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res
        .status(errorValidation)
        .send({ message: 'Передан пользователь с некорректным id' });
    } else {
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    }
  });

const getUsers = (req, res) => User.find({})
  .then((users) => res.send(users))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(errorValidation).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    }
  });

const updateUser = (req, res) => User.findByIdAndUpdate(
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
      res.status(403).send({ message: 'Невозможно изменять данные' });
    }
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(errorValidation).send({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
    } else if (err.name === 'CastError') {
      res.status(errorValidation).send({ message: 'Пользователь не найден' });
    } else {
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    }
  });

const updateAvatar = (req, res) => User.findByIdAndUpdate(
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
      res.status(errorValidation).send({
        message: 'Переданы некорректные данные при обновлении аватара',
      });
    } else if (err.name === 'CastError') {
      res.status(errorValidation).send({ message: 'Передан некорректный id' });
    } else {
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    }
  });

module.exports = {
  getUserInfo, createUser, getUser, getUsers, updateUser, updateAvatar, login,
};
