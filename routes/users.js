const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserInfo,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users/me', getUserInfo);
router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
}), updateAvatar);
module.exports = router;
