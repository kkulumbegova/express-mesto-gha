const Card = require('../models/card');

const errorNotFound = 404;
const errorValidation = 400;
const errorServer = 500;

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorValidation).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const getCards = (req, res) => Card.find({})
  .then((cards) => res.send(cards))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(errorValidation).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    }
  });

const deleteCard = (req, res) => Card.findByIdAndDelete(req.params.cardId)
  .then((card) => {
    if (card === null) {
      res.status(errorNotFound).send({ message: 'Карточка не найдена' });
    } else {
      res.send(card);
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(errorValidation).send({ message: 'Передан некорректный id' });
    } else {
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    }
  });

const addLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card === null) {
      res.status(errorNotFound).send({ message: 'Передан несуществующий id' });
    } else {
      res.send(card);
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(errorValidation).send({ message: 'Передан некорректный id для постановки/удаления лайка' });
    } else {
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    }
  });

const deleteLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card === null) {
      res.status(errorNotFound).send({ message: 'Передан несуществующий id' });
    } else {
      res.send(card);
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(errorValidation).send({ message: 'Передан некорректный id для постановки/удаления лайка' });
    } else {
      res.status(errorServer).send({ message: 'На сервере произошла ошибка' });
    }
  });

module.exports = {
  createCard,
  getCards,
  deleteCard,
  addLike,
  deleteLike,
};
