/* eslint-disable no-underscore-dangle */
const Movie = require('../models/movie');

const NotFoundError = require('../middlewares/errors/NotFoundError');
const BadRequest = require('../middlewares/errors/BadRequest');
const Forbidden = require('../middlewares/errors/Forbidden');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      throw new NotFoundError('Нет карточек с таким id');
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
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Нет карточки с таким id'));
      } else if (movie.owner === req.user._id) {
        Movie.findByIdAndDelete(movie._id)
          .then((del) => {
            if (del) {
              Movie.find({})
                .then((movies) => res.status(200).send({ data: movies }));
            }
          });
      } else {
        next(new Forbidden('Можно удалять только свои карточки'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные при удалении карточки.'));
      }
      next(err);
    });
};
