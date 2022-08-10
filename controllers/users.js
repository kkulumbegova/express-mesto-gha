const User = require('../models/user');

const errorNotFound = 404;
const errorValidation = 400;
const errorServer = 500;

const createUser = (req, res) => User.create(req.body)
  .then((user) => res.send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(errorValidation).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
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
  .then((user) => res.send(user))
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
  createUser, getUser, getUsers, updateUser, updateAvatar,
};
