const router = require('express').Router();

const {
  validateLogin,
  validateSignup,
} = require('../middlewares/validation');

const {

  NOT_FOUND,

} = require('../utils/constants');

const {
  login,
  createUser,
  signOut,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

const userRouter = require('./users');
const moviesRouter = require('./movies');

const NotFoundError = require('../middlewares/errors/NotFoundError');

router.post('/signout', signOut);
router.post('/signin', validateLogin, login);
router.post('/signup', validateSignup, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', moviesRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError(NOT_FOUND));
});

module.exports = router;
