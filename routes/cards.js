const router = require("express").Router();
const { createCard, getCards, deleteCard, addLike, deleteLike } = require('../controllers/cards');

router.post("/cards", createCard);
router.get("/cards", getCards);
router.delete("/cards/:cardId", deleteCard);
router.put("/cards/:cardId/likes", addLike);
router.delete("/cards/:cardId/likes", deleteLike);

module.exports = router;