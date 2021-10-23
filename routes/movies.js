const router = require('express').Router();

const {
  validateCreateMovie,
  validateDeleteMovie,
} = require('../middlewares/validation');

const {
  deleteMovie, getMovies, createMovie,
} = require('../controllers/movies');

// eslint-disable-next-line no-undef
router.delete('/:id', validateDeleteMovie, deleteMovie);

// eslint-disable-next-line no-undef
router.get('/', getMovies);

// eslint-disable-next-line no-undef
router.post('/', validateCreateMovie, createMovie);

module.exports = router;
