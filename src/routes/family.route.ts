import { Router } from 'express';
import authMiddleware from '@middlewares/auth.middleware';
import familyController from '@controllers/family/family.controller';

const routes = Router();

routes.get('/:familyId', authMiddleware, familyController.fetchFamily);
routes.get('/', authMiddleware, familyController.fetchFamilies);

export default routes;
