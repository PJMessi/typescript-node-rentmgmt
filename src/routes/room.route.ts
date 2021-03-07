import { Router } from 'express';
import { createRoom, fetchAllRooms } from '@controllers/room/room.controller';
import { validateForCreateRoom } from '@controllers/room/room.validation';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, validateForCreateRoom, createRoom);
router.get('/', authMiddleware, fetchAllRooms);

export default router;
