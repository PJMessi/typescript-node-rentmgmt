import { Router } from 'express';
import authMiddleware from '@middlewares/auth.middleware';
import { fetchFamily } from '@controllers/family/family.controller';

const routes = Router();

routes.get('/:familyId', authMiddleware, fetchFamily);

export default routes;
