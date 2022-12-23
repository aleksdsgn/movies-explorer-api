import winston from 'winston';
import expressWinston from 'express-winston';

// создадим логгер запросов
// Мы будем логировать два типа информации — запросы к серверу и ошибки,
// которые на нём происходят
export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
});

// логгер ошибок
export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});
