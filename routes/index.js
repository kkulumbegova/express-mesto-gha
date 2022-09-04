const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { signupValidation, signinValidation } = require('../middlewares/validation');
const NotFound = require('../errors/not-found-err');

router.post('/signup', signupValidation, createUser);
router.post('/signin', signinValidation, login);

router.use(auth);
router.use('/', usersRouter);
router.use('/', cardsRouter);
// router.post('/signout', (req, res) => {
//   res.send({ message: 'Выход' });
// });
router.use('/*', (req, res, next) => next(new NotFound('Неверный путь')));

module.exports = router;
