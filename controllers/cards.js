const Card = require('../models/card');
const NotFound = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch(next);
};

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

const deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw next(new NotFound('Карточка не найдена'));
      } else if (req.user._id === card.owner.toString()) {
        res.send(card);
      } else {
        throw next(new ForbiddenError('Невозможно удалить чужую карточку'));
      }
    })
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
    if (!card === null) {
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
