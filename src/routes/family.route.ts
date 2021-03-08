import { Router } from 'express';
import authMiddleware from '@middlewares/auth.middleware';
import { validateForCreateFamily } from '@controllers/family/family.validation';
import { createFamily } from '@controllers/family/family.controller';

const routes = Router();

routes.post('/', authMiddleware, validateForCreateFamily, createFamily);

export default routes;
