import { Movie } from '../models/movie.js';
import { ServerError } from '../errors/ServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';
import { errorMessages } from '../errors/messages.js';

// возвращает все сохранённые текущим  пользователем фильмы
// export const getMovies = (req, res, next) => {
//   Movie.find({})
//     .then((movies) => {
//       res.send({ data: movies });
//     })
//     .catch(() => {
//       next(new ServerError(errorMessages.badRequest));
//     });
// };
export const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch(() => {
      next(new ServerError(errorMessages.badRequest));
    });
};

// создаёт фильм с переданными в теле данными
// export const createMovie = (req, res, next) => {
//   Movie.create({ ...req.body, owner: req.user._id })
//     .then((document) => {
//       const movie = document.toObject();
//       res.send({ data: movie });
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequestError(errorMessages.badRequest));
//       } else {
//         next(new ServerError(errorMessages.serverError));
//       }
//     });
// };
export const createMovie = (req, res, next) => {
  req.body.owner = req.user._id;
  Movie.create(req.body)
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.badRequest));
      } else {
        next(new ServerError(errorMessages.serverError));
      }
    });
};

// удаляет сохранённый фильм по id
// export const deleteMovieById = (req, res, next) => {
//   Movie.findById(req.params.movieId)
//     .then((document) => {
//       if (document) {
//         const movie = document.toObject();
//         if (movie.owner.toString() === req.user._id) {
//           document.remove()
//             .then(() => {
//               res.send({ data: movie });
//             })
//             .catch(next);
//         } else next(new ForbiddenError(errorMessages.movieForbidden));
//       } else next(new NotFoundError(errorMessages.movieNotFound));
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError(errorMessages.badRequest));
//       } else {
//         next(new ServerError(errorMessages.serverError));
//       }
//     });
export const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie) {
        if (movie.owner.toString() === req.user._id) {
          movie.remove();
          res.send({ data: movie });
        } else next(new ForbiddenError(errorMessages.movieForbidden));
      } else next(new NotFoundError(errorMessages.movieNotFound));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.badRequest));
      } else {
        next(new ServerError(errorMessages.serverError));
      }
    });
};
