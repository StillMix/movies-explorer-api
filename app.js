/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const dotenv = require('dotenv');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./middlewares/errors/NotFoundError');

dotenv.config();

const {
  createUser, login, signOut,
} = require('./controllers/users');
// eslint-disable-next-line import/no-extraneous-dependencies

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const allowedCors = [
  'http://localhost:3000',
  'http://smfrtontendmesto.nomoredomains.rocks',
  'https://smfrtontendmesto.nomoredomains.rocks',
];

mongoose.connect('mongodb://localhost:27017/filmdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
});

app.use(cookieParser());
app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.post('/signout', signOut);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(20),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

const { auth } = require('./middlewares/auth');

app.use(auth);

app.use('/movies', moviesRouter);
app.use('/users', userRouter);

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Ссылка на сервер');
  // eslint-disable-next-line no-console
  console.log(BASE_PATH);
});

app.use(errors());

app.use((err, req, res) => {
  res.status(err.statusCode).send({ message: `${err.message}` });
});
