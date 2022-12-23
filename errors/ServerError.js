import { constants } from 'http2';

// 500 - сервер столкнулся с неожиданной ошибкой
export class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}
