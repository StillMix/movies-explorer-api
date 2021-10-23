/* eslint-disable func-names */
/* eslint-disable no-dupe-keys */
/* eslint-disable import/no-unresolved */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const Unauthorized = require('../middlewares/errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Поле "name" обязательно для заполнения.'],
    minLength: [2, 'Минимальная длинная поля "name" - 2'],
    maxLength: [30, 'Максимальная длинная поля "name" - 30'],
  },
  email: {
    type: String,
    require: [true, 'Поле "email" обязательно для заполнения.'],
    unique: true,
    validate: {
      validator: (ava) => validator.isEmail(ava),
      message: 'Неверная почта',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неправильные почта или пароль');
      } else {
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              throw new Unauthorized('Неправильные почта или пароль');
            } else {
              return user;
            }
          });
      }
    });
};

function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

userSchema.methods.toJSON = toJSON;

module.exports = mongoose.model('user', userSchema);
