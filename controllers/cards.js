const Card = require('../models/card');
const ERROR_VALIDATION = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

const createCard = (req, res) => {
    const { name, link } = req.body;
    const owner = req.user._id;
    return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch(err => {
        if(err.name === "ValidationError") {
          res.status(ERROR_VALIDATION).send({ message: "Переданы некорректные данные при создании карточки"})
        } else {
          res.status(ERROR_SERVER).send({ message: "На сервере произошла ошибка"})
        }
    })
};

const getCards = (req, res) => {
    return Card.find({})
    .then(cards => res.status(200).send(cards))
    .catch(err => {
        if(err.name === "ValidationError") {
          res.status(ERROR_VALIDATION).send({ message: "Переданы некорректные данные"})
        } else {
          res.status(ERROR_SERVER).send({ message: "На сервере произошла ошибка"})
        }
    })
};

const deleteCard = (req, res) => {
    return Card.findByIdAndDelete(req.params.cardId)
    .then(card => res.status(200).send(card))
    .catch(err => {console.log(err.name);
        if(err.name === "CastError") {
          res.status(ERROR_NOT_FOUND).send({ message: "Карточка не найдена"})
        } else {
          res.status(ERROR_SERVER).send({ message: "На сервере произошла ошибка"})
        }
    })
};

const addLike = (req, res) => {
    return Card.findByIdAndUpdate(
        req.params.cardId, 
        { $addToSet: { likes: req.user._id } },
        { new: true },
    )
    .then(card => res.status(200).send(card))
    .catch(err => {
        if(err.name === "ValidationError") {
          res.status(ERROR_VALIDATION).send({ message: "Переданы некорректные данные для постановки лайка"})
        } else  if (err.name === "CastError") {
           res.status(ERROR_NOT_FOUND).send({ message: "Передан несуществующий id карточки"})
        } else {
            res.status(ERROR_SERVER).send({ message: `На сервере произошла ошибка`})
        }
    })
};

const deleteLike = (req, res) => {
    return Card.findByIdAndUpdate(
        req.params.cardId, 
        { $pull: { likes: req.user._id } },
        { new: true },
    )
    .then(card => res.status(200).send(card))
    .catch(err => {
        if(err.name === "ValidationError") {
          res.status(ERROR_VALIDATION).send({ message: "Переданы некорректные данные для снятия лайка"})
        } else  if (err.name === "CastError") {
           res.status(ERROR_NOT_FOUND).send({ message: "Передан несуществующий id карточки"})
        } else {
            res.status(ERROR_SERVER).send({ message: `На сервере произошла ошибка`})
        }
    })
};

module.exports = { createCard, getCards, deleteCard, addLike, deleteLike };