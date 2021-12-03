/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-multi-spaces */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../middlewares/errors/NotFoundError');
const BadRequest = require('../middlewares/errors/BadRequest');
const Conflict = require('../middlewares/errors/Conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
} = require('../utils/constants');

// eslint-disable-next-line no-undef

module.exports.getInfoUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((users) => {
      if (!users) {
        next(new NotFoundError(NOT_FOUND));
      }
      return res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(BAD_REQUEST));
      }
      next(err);
    });
};

module.exports.patchInfoUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    next(new BadRequest(BAD_REQUEST));
  }

  if (name === null || email === null) {
    next(new BadRequest(BAD_REQUEST));
  }

  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        next(new NotFoundError(NOT_FOUND));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQUEST));
      }
      next(err);
    });
};

module.exports.signOut = (req, res, next) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  }).status(201).send({ message: 'Удачного дня))' });
};

// eslint-disable-next-line no-undef
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    next(new BadRequest(BAD_REQUEST));
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new Conflict(CONFLICT));
      }

      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            email,
            password: hash,
            name,
          })
            .then((user) => res.status(201).send(user))
            .catch((err) => {
              if (err.name === 'ValidationError') {
                next(new BadRequest(BAD_REQUEST));
              }
              next(err);
            });
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  console.log(email, password);

  if (!email || !password) {
    next(new BadRequest(BAD_REQUEST));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (user) {
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
        res.cookie('jwt', token, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
          .status(200).send({ user: user.toJSON() });
      }
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQUEST));
      }
      next(err);
    });
};
