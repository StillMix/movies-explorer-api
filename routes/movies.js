const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  deleteMovie, getMovies, createMovie,
} = require('../controllers/movies');

// eslint-disable-next-line no-undef
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

// eslint-disable-next-line no-undef
router.get('/', getMovies);

// eslint-disable-next-line no-undef
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailer: Joi.string().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required(),
  }),
}), createMovie);

module.exports = router;
