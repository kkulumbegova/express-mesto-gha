const mongoose = require('mongoose');
const express = require('express');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62ee6dd40a73a395049483c3',
  };
  next();
});

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('/*', (err, res) => {
  if (res) {
    res.status(404).send({ message: 'Неверный путь' });
  }
});

app.listen(PORT, () => {});
