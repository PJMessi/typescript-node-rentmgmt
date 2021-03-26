import { Router } from 'express';
import authMiddleware from '@middlewares/auth.middleware';
import {
  fetchFamily,
  fetchFamilies,
} from '@controllers/family/family.controller';

const routes = Router();

routes.get('/:familyId', authMiddleware, fetchFamily);
routes.get('/', authMiddleware, fetchFamilies);

export default routes;
