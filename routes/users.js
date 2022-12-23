import { Router } from 'express';
import {
  // celebrateParamsRouteMe,
  celebrateBodyProfile,
  // celebrateBodyAvatar,
} from '../validators/users.js';

import {
  getCurrentUser,
  updateUser,
} from '../controllers/users.js';

export const router = Router();

// возвращает информацию о пользователе (email и имя)
router.get('/me', getCurrentUser);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', celebrateBodyProfile, updateUser);
