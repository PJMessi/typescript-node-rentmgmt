import { Router } from 'express';
import authMiddleware from '@middlewares/auth.middleware';
import { changeRoom, fetchFamily } from '@controllers/family/family.controller';

const routes = Router();

routes.get('/:familyId', authMiddleware, fetchFamily);
routes.post('/:familyId/rooms/:roomId/change', authMiddleware, changeRoom);

export default routes;
