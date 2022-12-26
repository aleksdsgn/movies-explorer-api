import { constants } from 'http2';

// 400 - cервер не смог понять запрос из-за недействительного синтаксиса.
// Клиент не должен повторять этот запрос без изменений.
export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
  }
}
