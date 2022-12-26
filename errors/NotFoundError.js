import { constants } from 'http2';

// 404 - сервер не может найти запрошенный ресурс.
export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_NOT_FOUND;
  }
}
