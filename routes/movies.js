import { Router } from 'express';
import {
  celebrateBodyMovie,
  celebrateParamsRouteId,
} from '../validators/movies.js';

import {
  getMovies,
  createMovie,
  deleteMovieById,
} from '../controllers/movies.js';

export const router = Router();

// возвращает все сохранённые текущим  пользователем фильмы
router.get('/', getMovies);

// создаёт фильм с переданными в теле данными
router.post('/', celebrateBodyMovie, createMovie);

// удаляет сохранённый фильм по id
router.delete('/:movieId', celebrateParamsRouteId, deleteMovieById);
