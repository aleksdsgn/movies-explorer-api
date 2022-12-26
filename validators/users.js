import { Joi, Segments } from 'celebrate';
import { celebrate } from './common.js';

// примитивные значения с обязательными полями
export const schemeEmail = Joi.string().email().required();
const schemePassword = Joi.string().required();
// примитивные значения с без обязательных полей
const schemeName = Joi.string().min(2).max(30);

// схема обновления информации о пользователе
const schemeObjectProfile = Joi.object({
  name: schemeName,
  email: schemeEmail,
}).required();

// схема авторизации
const schemeObjectAuth = Joi.object({
  email: schemeEmail,
  password: schemePassword,
}).required();

// схема для регистрации
const schemeObjectUser = schemeObjectAuth
  .concat(schemeObjectProfile)
  .concat(Joi.object({
    name: schemeName,
  }).required());

// сегменты из схем
const segmentBodyProfile = { [Segments.BODY]: schemeObjectProfile };
const segmentBodyAuth = { [Segments.BODY]: schemeObjectAuth };
const segmentBodyUser = { [Segments.BODY]: schemeObjectUser };

// мидлвары
export const celebrateBodyProfile = celebrate(segmentBodyProfile);
export const celebrateBodyAuth = celebrate(segmentBodyAuth);
export const celebrateBodyUser = celebrate(segmentBodyUser);
