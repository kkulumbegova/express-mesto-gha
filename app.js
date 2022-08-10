import { connect } from 'mongoose';
import express, { json } from 'express';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

// eslint-disable-next-line no-undef
const { PORT = 3000 } = process.env;

connect('mongodb://localhost:27017/mestodb');
const app = express();
app.use(json());

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
