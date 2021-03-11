import { Router } from 'express';
import {
  createRoom,
  fetchAllRooms,
  fetchRoom,
  addFamily,
} from '@controllers/room/room.controller';
import {
  validateForCreateRoom,
  validateForAddFamily,
} from '@controllers/room/room.validation';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, validateForCreateRoom, createRoom);
router.get('/', authMiddleware, fetchAllRooms);
router.get('/:roomId', authMiddleware, fetchRoom);
router.post(
  '/:roomId/families',
  authMiddleware,
  validateForAddFamily,
  addFamily
);

export default router;
