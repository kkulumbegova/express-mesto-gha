const router = require('express').Router();
const { createCardValidation, cardIdValidation } = require('../middlewares/validation');
const {
  createCard,
  getCards,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.post('/cards', createCardValidation, createCard);
router.get('/cards', getCards);
router.delete('/cards/:cardId', cardIdValidation, deleteCard);
router.put('/cards/:cardId/likes', cardIdValidation, addLike);
router.delete('/cards/:cardId/likes', cardIdValidation, deleteLike);

module.exports = router;
