import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { errors } from 'celebrate';
import { router } from './routes/index.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';
import { limiter } from './middlewares/limiter.js';
import { errorHandler } from './middlewares/errorHandler.js';

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

app.use(helmet());

app.use(limiter);

app.use(cors({
  origin: '*',
  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],
}));

app.set('config', config);
app.use(bodyParser.json());

app.use(requestLogger);

// подключение всех роутов
app.use(router);

app.use(errorLogger);

// обработчик ошибок celebrate. перехватывает и передает их наружу
app.use(errors());

// централизованный обработчик ошибок
app.use(errorHandler);

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
