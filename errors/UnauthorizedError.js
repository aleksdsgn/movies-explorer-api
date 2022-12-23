import { constants } from 'http2';

// 401 — передан неверный логин или пароль
// или если передан неверный JWT
export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
  }
}
