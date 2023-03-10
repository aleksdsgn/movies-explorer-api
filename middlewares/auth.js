import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { errorMessages } from '../errors/messages.js';

export const auth = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization = '' } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization) {
    next(new UnauthorizedError(errorMessages.authorizationReq));
    return;
  }
  // извлечём токен
  const token = authorization.replace(/^Bearer*\s*/i, '');
  let payload;

  const { JWT_SECRET } = req.app.get('config');
  try {
    // пытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new UnauthorizedError(errorMessages.tokenNotVerified));
  }
  // записываем пейлоуд в объект запроса
  req.user = payload;
  // пропускаем запрос дальше
  next();
};
