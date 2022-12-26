import { constants } from 'http2';

// 409 — при регистрации указан email,
// который уже существует на сервере
export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = constants.HTTP_STATUS_CONFLICT;
  }
}
