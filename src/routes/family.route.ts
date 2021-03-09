import { Router } from 'express';
import authMiddleware from '@middlewares/auth.middleware';
import { validateForCreateFamily } from '@controllers/family/family.validation';
import {
  createFamily,
  assignRoom,
  fetchFamily,
} from '@controllers/family/family.controller';

const routes = Router();

routes.post('/', authMiddleware, validateForCreateFamily, createFamily);
routes.get('/:familyId', authMiddleware, fetchFamily);
routes.post('/:familyId/rooms/:roomId', authMiddleware, assignRoom);

export default routes;
