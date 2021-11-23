/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const dotenv = require('dotenv');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');

const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

// const rateLimiter = require('./middlewares/rateLimit');

const {
  MONGO_ADDRESS,
  PORT_NUMBER,
  ALLOWED_CORS,
} = require('./utils/constants');

// eslint-disable-next-line import/no-extraneous-dependencies

const { PORT = PORT_NUMBER, BASE_PATH } = process.env;
const app = express();

app.use(cookieParser());
app.use(express.json());

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

mongoose.connect(MONGO_ADDRESS, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const corsOptions = {
  origin: ALLOWED_CORS,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(requestLogger);

app.use(helmet());

// app.use(rateLimiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);

app.use(errorLogger);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Ссылка на сервер');
  // eslint-disable-next-line no-console
  console.log(BASE_PATH);
});

app.use(errors());

app.use(errorHandler);
