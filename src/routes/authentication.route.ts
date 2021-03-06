import { Router } from 'express';
import {
  registerUser,
  loginuser,
  fetchProfile,
} from '@controllers/authentication/authentication.controller';
import {
  validateForLoginUser,
  validateForRegisterUser,
} from '@controllers/authentication/authentication.validation';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.post('/register', validateForRegisterUser, registerUser);
router.post('/login', validateForLoginUser, loginuser);
router.get('/profile', authMiddleware, fetchProfile);

export default router;
