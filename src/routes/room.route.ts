import { Router } from 'express';
import roomController from '@controllers/room/room.controller';
import roomApiValidator from '@controllers/room/room.validation';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  roomApiValidator.createRoomValidate,
  roomController.createRoom
);
router.get('/', authMiddleware, roomController.fetchAllRooms);
router.get('/:roomId', authMiddleware, roomController.fetchRoom);
router.post(
  '/:roomId/families',
  authMiddleware,
  roomApiValidator.addFamilyValidate,
  roomController.addFamily
);

export default router;
