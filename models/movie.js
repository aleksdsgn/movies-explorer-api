import mongoose from 'mongoose';
import { linkRegex } from '../validators/common.js';

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => linkRegex.test(value),
      message: (props) => `${props.value} Проверьте корректность ссылки`,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (value) => linkRegex.test(value),
      message: (props) => `${props.value} Проверьте корректность ссылки`,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => linkRegex.test(value),
      message: (props) => `${props.value} Проверьте корректность ссылки`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: false });

export const Movie = mongoose.model('movie', movieSchema);
