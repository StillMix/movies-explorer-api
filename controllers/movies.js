/* eslint-disable no-underscore-dangle */
const Movie = require('../models/movie');

const NotFoundError = require('../middlewares/errors/NotFoundError');
const BadRequest = require('../middlewares/errors/BadRequest');
const Forbidden = require('../middlewares/errors/Forbidden');

const {
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN_MOVIE,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      throw new NotFoundError(NOT_FOUND);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;

  Movie.create(
    {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    },
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQUEST));
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError(NOT_FOUND));
      } else if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndDelete(movie._id)
          .then((del) => {
            if (del) {
              Movie.find({})
                .then((movies) => res.status(200).send({ data: movies }));
            }
          });
      } else {
        next(new Forbidden(FORBIDDEN_MOVIE));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(BAD_REQUEST));
      }
      next(err);
    });
};
