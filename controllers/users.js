const User = require('../models/user');

const createUser = (req, res) =>
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });

const getUser = (req, res) =>
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        res.status(500).send({ message: 'Пользователь не найден' });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Передан пользователь с некорректным id' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });

const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });

const updateUser = (req, res) =>
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else if (err.name === 'CastError') {
        res.status(500).send({ message: 'Пользователь не найден' });
      } else {
        res.status(404).send({ message: `На сервере произошла ошибка` });
      }
    });

const updateAvatar = (req, res) =>
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: `На сервере произошла ошибка` });
      }
    });

module.exports = { createUser, getUser, getUsers, updateUser, updateAvatar };
