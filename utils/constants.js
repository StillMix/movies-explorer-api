const BAD_REQUEST = 'Переданы некорректные данные';
const NOT_FOUND = 'Страница не найдена';
const FORBIDDEN_MOVIE = 'Можно удалять только свои карточки';
const CONFLICT = 'Пользователь уже существует';

const MONGO_ADDRESS = 'mongodb://localhost:27017/moviesdb';
const PORT_NUMBER = 3000;
const ALLOWED_CORS = [
  'http://localhost:3000',
  'http://smfrtontendmesto.nomoredomains.rocks',
  'https://smfrtontendmesto.nomoredomains.rocks',
];

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN_MOVIE,
  CONFLICT,
  MONGO_ADDRESS,
  PORT_NUMBER,
  ALLOWED_CORS,
};
