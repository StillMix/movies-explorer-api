const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getInfoUser, patchInfoUser,
} = require('../controllers/users');

// eslint-disable-next-line no-undef
router.get('/me', getInfoUser);

// eslint-disable-next-line no-undef
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
  }),
}), patchInfoUser);

module.exports = router;
