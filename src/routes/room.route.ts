import { Router } from 'express';
import roomController from '@controllers/room/room.controller';
import {
  validateForCreateRoom,
  validateForAddFamily,
} from '@controllers/room/room.validation';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  validateForCreateRoom,
  roomController.createRoom
);
router.get('/', authMiddleware, roomController.fetchAllRooms);
router.get('/:roomId', authMiddleware, roomController.fetchRoom);
router.post(
  '/:roomId/families',
  authMiddleware,
  validateForAddFamily,
  roomController.addFamily
);

export default router;
