import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { emailRegex } from '../validators/common.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { errorMessages } from '../errors/messages.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => emailRegex.test(value),
      message: (props) => `${props.value} ${errorMessages.checkEmail}`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  // ищем пользователя по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((document) => {
      // не нашёлся — отклоняем промис
      if (!document) {
        throw new UnauthorizedError(errorMessages.incorrectEmailOrPassword);
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, document.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(errorMessages.incorrectEmailOrPassword);
          }

          const user = document.toObject();
          delete user.password;
          return user;
        });
    });
};

export const User = mongoose.model('user', userSchema);
