const User = require('../models/user');
const ERROR_VALIDATION = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;


const createUser = (req, res) => {
    return User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch(err => {
        if(err.name === "ValidationError") {
          res.status(ERROR_VALIDATION).send({ message: "Переданы некорректные данные при создании пользователя"})
        } else {
          res.status(ERROR_SERVER).send({ message: "На сервере произошла ошибка"})
        }
    })
};

const getUser = (req, res) => {
    return User.findById(req.params.userId)
      .then(user => res.status(200).send({ data: user }))
      .catch(err => {
          if(err.name === "CastError") {
            res.status(ERROR_NOT_FOUND).send({ message: "Пользователь не найден"})
          } else {
            res.status(ERROR_SERVER).send({ message: "На сервере произошла ошибка"})
          }
      })
};

const getUsers = (req, res) => {
    return User.find({})
    .then(users => res.status(200).send(users))
    .catch(err => {
        if(err.name === "ValidationError") {
          res.status(ERROR_VALIDATION).send({ message: "Переданы некорректные данные"})
        } else {
          res.status(ERROR_SERVER).send({ message: "На сервере произошла ошибка"})
        }
    })
};

const updateUser = (req, res) => {
    return User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, 
        {
        new: true,
        runValidators: true,
        upsert: true
        }
    )
    .then(user => res.status(200).send(user))
    .catch(err => {
        if(err.name === "ValidationError") {
          res.status(ERROR_VALIDATION).send({ message: "Переданы некорректные данные при обновлении профиля"})
        } else  if (err.name === "CastError") {
           res.status(ERROR_NOT_FOUND).send({ message: "Пользователь не найден"})
        } else {
            res.status(ERROR_SERVER).send({ message: `На сервере произошла ошибка`})
        }
    })
};

const updateAvatar = (req, res) => {
    console.log(req.user._id);
    return User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, 
        {
        new: true,
        runValidators: true,
        upsert: true
        }
    )
    .then(user => res.status(200).send(user))
    .catch(err => {
        if(err.name === "ValidationError") {
          res.status(ERROR_VALIDATION).send({ message: "Переданы некорректные данные при обновлении аватара"})
        } else  if (err.name === "CastError") {
           res.status(ERROR_NOT_FOUND).send({ message: "Пользователь не найден"})
        } else {
            res.status(ERROR_SERVER).send({ message: `На сервере произошла ошибка`})
        }
    })
};

module.exports = { createUser, getUser, getUsers, updateUser, updateAvatar };