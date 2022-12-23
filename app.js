import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
// import path from 'path';
import cors from 'cors';
import { constants } from 'http2';
import { errors } from 'celebrate';
import { router } from './routes/index.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';

// обработка необработанных ошибок
process.on('unhandledRejection', (err) => {
  // логирование
  console.error(err);
  // выход из приложения с ошибкой
  process.exit(1);
});

const { NODE_ENV } = process.env;

const config = dotenv.config({
  path: NODE_ENV === 'production' ? '.env' : '.env.common',
}).parsed;

const app = express();

app.use(cors({
  origin: '*',
  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],
}));

app.set('config', config);
app.use(bodyParser.json());
// app.use(cookieParser());

app.use(requestLogger);

// подключение всех роутов
app.use(router);

app.use(errorLogger);

// обработчик ошибок celebrate. перехватывает и передает их наружу
app.use(errors());

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const status = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = err.message || 'Произошла неизвестная ошибка';
  res.status(status).send({ message });
  next();
});

mongoose.connect(config.DB_URL);

const server = app.listen(config.PORT, () => {
  console.log(`Приложение прослушивает порт ${config.PORT}`);
});

// намеренная остановка сервера
const stop = async () => {
  await mongoose.connection.close();
  server.close();
  // выход из приложения без ошибки
  process.exit(0);
};

process.on('SIGTERM', stop);
process.on('SIGINT', stop);
