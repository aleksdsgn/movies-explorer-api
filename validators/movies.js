import { Joi, Segments } from 'celebrate';
import {
  celebrate,
  schemeObjectId,
  schemeURL,
} from './common.js';

export const schemeRouteId = schemeObjectId;

export const schemeObjectRouteId = Joi.object({
  movieId: schemeRouteId,
}).required();

// обязательно как сама ссылка так и сам объект со ссылкой
export const schemaObjectMovie = Joi.object({
  country: Joi.string().required(),
  director: Joi.string().required(),
  duration: Joi.number().required(),
  year: Joi.string().required(),
  description: Joi.string().required(),
  image: schemeURL.required(),
  trailer: schemeURL.required(),
  nameRU: Joi.string().required(),
  nameEN: Joi.string().required(),
  thumbnail: schemeURL.required(),
  movieId: Joi.number().required(),
});

// сегменты из схем
const segmentBodyMovie = { [Segments.BODY]: schemaObjectMovie };
const segmentParamsRouteId = { [Segments.PARAMS]: schemeObjectRouteId };

// мидлвары
export const celebrateBodyMovie = celebrate(segmentBodyMovie);
export const celebrateParamsRouteId = celebrate(segmentParamsRouteId);
