import { constants } from 'http2';
import { errorMessages } from '../errors/messages.js';

// централизованный обработчик ошибок
export const errorHandler = ((err, req, res, next) => {
  const status = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = err.message || errorMessages.serverError;
  res.status(status).send({ message });
  next();
});
