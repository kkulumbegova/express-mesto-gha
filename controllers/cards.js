const Card = require('../models/card');
const NotFound = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const ValidationError = require('../errors/validation-err');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

const deleteCard = (req, res, next) => {
  const id = req.params.cardId;
  Card.findById(id)
    .orFail(() => new NotFound('Нет карточки по заданному id'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Невозможно удалить чужую карточку'));
      }
      return card.remove();
    })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch(next);
};

const addLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw next(new NotFound('Карточка не найдена'));
    } res.send(card);
  })
  .catch(next);

const deleteLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw next(new NotFound('Передан несуществующий id'));
    } res.send(card);
  })
  .catch(next);

module.exports = {
  createCard,
  getCards,
  deleteCard,
  addLike,
  deleteLike,
};
