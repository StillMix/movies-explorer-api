const router = require('express').Router();

const {
  validateId,
  validatePatchInfoUser,
} = require('../middlewares/validation');

const {
  getInfoUser, patchInfoUser,
} = require('../controllers/users');

// eslint-disable-next-line no-undef
router.get('/me', validateId, getInfoUser);

// eslint-disable-next-line no-undef
router.patch('/me', validatePatchInfoUser, patchInfoUser);

module.exports = router;
