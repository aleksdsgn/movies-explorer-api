import { Movie } from '../models/movie.js';
import { ServerError } from '../errors/ServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';

// возвращает все сохранённые текущим  пользователем фильмы
export const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch(() => {
      next(new ServerError('Произошла ошибка на сервере'));
    });
};

// создаёт фильм с переданными в теле данными
export const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((document) => {
      const movie = document.toObject();
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('createMovie Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка на сервере'));
      }
    });
};

// удаляет сохранённый фильм по id
export const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((document) => {
      if (document) {
        const movie = document.toObject();
        if (movie.owner.toString() === req.user._id) {
          document.remove()
            .then(() => {
              res.send({ data: movie });
            })
            .catch(next);
        } else next(new ForbiddenError('Удалить можно только свои фильмы'));
      } else next(new NotFoundError('Фильм не найден'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка на сервере'));
      }
    });
};
