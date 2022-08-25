const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { signupValidation, signinValidation } = require('./middlewares/validation');
const NotFound = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');
const app = express();
app.use(express.json());
app.use(cookieParser());

app.post('/signup', signupValidation, createUser);
app.post('/signin', signinValidation, login);

app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('/*', (req, res, next) => next(new NotFound('Неверный путь')));
app.use(errors());
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
});
app.listen(PORT, () => {});
