const BAD_REQUEST = 'Переданы некорректные данные';
const NOT_FOUND = 'Страница не найдена';
const FORBIDDEN_MOVIE = 'Можно удалять только свои карточки';
const CONFLICT = 'Пользователь уже существует';

const MONGO_ADDRESS = 'mongodb://localhost:27017/moviesdb';
const PORT_NUMBER = 3001;
const ALLOWED_CORS = [
  'http://frontend-movies.nomoredomains.rocks',
  'https://frontend-movies.nomoredomains.rocks',
  'http://localhost:3000',
  'http://frontend-movies.nomoredomains.rocks/',
  'https://frontend-movies.nomoredomains.rocks/',
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
