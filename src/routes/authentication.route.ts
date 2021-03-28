import { Router } from 'express';
import authcontroller from '@controllers/authentication/authentication.controller';
import {
  validateForLoginUser,
  validateForRegisterUser,
} from '@controllers/authentication/authentication.validation';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.post('/register', validateForRegisterUser, authcontroller.registerUser);
router.post('/login', validateForLoginUser, authcontroller.loginuser);
router.get('/profile', authMiddleware, authcontroller.fetchProfile);

export default router;
