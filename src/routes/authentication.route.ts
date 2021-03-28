import { Router } from 'express';
import authcontroller from '@controllers/authentication/authentication.controller';
import authApiValidatior from '@controllers/authentication/authentication.validation';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.post(
  '/register',
  authApiValidatior.registerUserValidate,
  authcontroller.registerUser
);
router.post(
  '/login',
  authApiValidatior.loginuserValidate,
  authcontroller.loginuser
);
router.get('/profile', authMiddleware, authcontroller.fetchProfile);

export default router;
