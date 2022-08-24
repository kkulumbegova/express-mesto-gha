const router = require('express').Router();
const {
  getUserInfo,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const { updateUserValidation, updateAvatarValidation, getUserValidation } = require('../middlewares/validation');

router.get('/users/me', getUserInfo);
router.get('/users', getUsers);
router.get('/users/:userId', getUserValidation, getUser);
router.patch('/users/me', updateUserValidation, updateUser);
router.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;
