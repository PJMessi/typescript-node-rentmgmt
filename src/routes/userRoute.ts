import { Router } from 'express';
import {
  registerUser,
  loginuser,
} from '@controllers/authentication/authenticationController';
import {
  validateForLoginUser,
  validateForRegisterUser,
} from '@controllers/authentication/authenticationValidation';

const router = Router();

router.post('/register', validateForRegisterUser, registerUser);
router.post('/login', validateForLoginUser, loginuser);

export default router;
