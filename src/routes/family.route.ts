import { Router } from 'express';
import authMiddleware from '@middlewares/auth.middleware';
import { validateForCreateFamily } from '@controllers/family/family.validation';
import {
  createFamily,
  assignRoom,
} from '@controllers/family/family.controller';

const routes = Router();

routes.post('/', authMiddleware, validateForCreateFamily, createFamily);
routes.post('/:familyId/rooms/:roomId', authMiddleware, assignRoom);

export default routes;
