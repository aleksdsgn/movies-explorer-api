import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { ServerError } from '../errors/ServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { errorMessages } from '../errors/messages.js';

// получить информацию о текущем пользователе
export const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError(errorMessages.userNotFound));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.badRequest));
      } else {
        next(new ServerError(errorMessages.serverError));
      }
    });
};

// добавить нового пользователя
export const register = (req, res, next) => {
  // сохранение в БД захешированного пароля пришедшего от пользователя
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      // замена пароля на хэш
      req.body.password = hash;
      // создание пользователя
      return User.create(req.body);
    })
    // пользователь возвращается как документ
    .then((document) => {
      const user = document.toObject();
      delete user.password;
      // возвращем пользователя без пароля
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.badRequest));
        // проверка на пользователя с существующим email в БД
      } else if (err.code === 11000) {
        next(new ConflictError(errorMessages.userConflict));
      } else {
        next(new ServerError(errorMessages.serverError));
      }
    });
};

// вход для существующего пользователя
export const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const { JWT_SECRET } = req.app.get('config');
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};

// обновить текстовые данные пользователя
export const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError(errorMessages.userNotFound));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.badRequest));
      } else if (err.code === 11000) {
        next(new ConflictError(errorMessages.userConflict));
      } else {
        next(new ServerError(errorMessages.serverError));
      }
    });
};
