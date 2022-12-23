import { constants } from 'http2';

// 403 — попытка удалить чужую карточку
// сервер понял запрос, но отказывается его авторизовать
export class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_FORBIDDEN;
  }
}
