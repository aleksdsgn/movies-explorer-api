import { Joi, celebrator } from 'celebrate';

export const linkRegex = /^https?:\/\/(www.)?[0-9A-Za-z-]+\.[0-9A-Za-z]+[\w-._~:/?#[\]@!$'()*+,;=]*#?/;
export const emailRegex = /^.+@.+$/;

// конфиг для celebrate
export const celebrate = celebrator(
  // настройка для celebrate
  // будет проверен весь запрос и params и body
  // даже если в каждом из них есть ошибки
  { mode: 'full' },
  // настройка для Joi
  // проверяет всю схему целиком не прерывается при первой же ошибке
  // возвращает объект в котором описаны все ошибки
  { abortEarly: false },
);

// универсальная проверка на ObjectId для карточек и для пользователя
// проверка что это hex-строка длинной в 24 символа
export const schemeObjectId = Joi.string().hex().length(24);

// проверка на url-ы
export const schemeURL = Joi.string().pattern(linkRegex);
