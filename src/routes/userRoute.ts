import { Router } from 'express';
import {
  registerUser,
  loginuser,
} from '@root/controllers/authentication/authentication.controller';
import {
  validateForLoginUser,
  validateForRegisterUser,
} from '@root/controllers/authentication/authentication.validation';

const router = Router();

router.post('/register', validateForRegisterUser, registerUser);
router.post('/login', validateForLoginUser, loginuser);

export default router;
